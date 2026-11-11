// Integration tests: real Postgres, real HTTP, a stub standing in for Gemini.
// Run:  TEST_DATABASE_URL=postgres://... npm test      (WARNING: wipes the public schema of that database)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dbUrl = process.env.TEST_DATABASE_URL;
if (!dbUrl) {
  console.log('TEST_DATABASE_URL not set; skipping');
  process.exit(0);
}

// ---- stub Gemini ----
const geminiCalls = [];
let geminiMode = 'ok';
const gemini = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => (raw += c));
  req.on('end', () => {
    geminiCalls.push({ url: req.url, key: req.headers['x-goog-api-key'], body: JSON.parse(raw) });
    if (geminiMode === '429') { res.writeHead(429).end('{}'); return; }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Stub owl says hi!' }] }, finishReason: 'STOP' }] }));
  });
});
await new Promise((r) => gemini.listen(0, r));

const uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fm-up-'));
Object.assign(process.env, {
  DATABASE_URL: dbUrl, JWT_SECRET: 'test-secret', SEED_PASSWORD: 'pw-test-123',
  GEMINI_API_KEY: 'stub-key', GEMINI_MODEL: 'stub-model', GEMINI_BASE_URL: `http://127.0.0.1:${gemini.address().port}`,
  MAX_UPLOAD_MB: '1', S3_BUCKET: '',
});

const { pool, migrate, seedIfEmpty, readSeedCourse, query } = await import('../src/db.js');
const { replaceTree } = await import('../src/courseStore.js');
const { createApp } = await import('../src/app.js');
const { config } = await import('../src/config.js');
config.uploadsDir = uploadsDir;

let server, base;
const tokens = {};

const api = async (method, url, { token, json, body, headers } = {}) => {
  const res = await fetch(base + url, {
    method,
    headers: { ...(token ? { authorization: `Bearer ${token}` } : {}), ...(json ? { 'content-type': 'application/json' } : {}), ...headers },
    body: json ? JSON.stringify(json) : body,
    redirect: 'manual',
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, res };
};
const login = async (role) => {
  const r = await api('POST', '/api/auth/login', { json: { email: `${role}@futureminds.demo`, password: 'pw-test-123', role } });
  assert.equal(r.status, 200, `login ${role}`);
  return r.data.token;
};

before(async () => {
  await pool.query('drop schema public cascade; create schema public;');
  await migrate();
  await seedIfEmpty(replaceTree);
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
  for (const role of ['admin', 'teacher', 'student', 'parent']) tokens[role] = await login(role);
});
after(async () => { server.close(); gemini.close(); await pool.end(); fs.rmSync(uploadsDir, { recursive: true, force: true }); });

test('health', async () => {
  assert.deepEqual((await api('GET', '/api/health')).data, { ok: true });
});

test('login: wrong password, unknown user, wrong portal', async () => {
  assert.equal((await api('POST', '/api/auth/login', { json: { email: 'admin@futureminds.demo', password: 'nope' } })).status, 401);
  assert.equal((await api('POST', '/api/auth/login', { json: { email: 'ghost@x.com', password: 'nope' } })).status, 401);
  const wrong = await api('POST', '/api/auth/login', { json: { email: 'student@futureminds.demo', password: 'pw-test-123', role: 'admin' } });
  assert.equal(wrong.status, 403, 'a student cannot sign in through the admin portal');
  assert.equal((await api('GET', '/api/auth/me', { token: tokens.admin })).data.user.role, 'admin');
});

test('course: needs login, returns the full seeded tree without null holes', async () => {
  assert.equal((await api('GET', '/api/course')).status, 401);
  const r = await api('GET', '/api/course', { token: tokens.student });
  assert.equal(r.status, 200);
  assert.equal(r.data.chapters.length, 9);
  const assets = r.data.chapters.flatMap((c) => c.units.flatMap((u) => u.subtopics.flatMap((s) => s.assets)));
  assert.equal(assets.length, 57);
  assert.ok(r.data.chapters.every(Boolean));
});

test('course: DB round-trip is lossless vs the seed file', async () => {
  const r = await api('GET', '/api/course', { token: tokens.admin });
  assert.deepEqual(r.data, readSeedCourse());
});

test('CMS WRITE IS ADMIN-ONLY: anonymous, student, teacher, parent all refused', async () => {
  const tree = (await api('GET', '/api/course', { token: tokens.admin })).data;
  assert.equal((await api('PUT', '/api/course', { json: tree })).status, 401);
  for (const role of ['student', 'teacher', 'parent']) {
    assert.equal((await api('PUT', '/api/course', { token: tokens[role], json: tree })).status, 403, role);
    assert.equal((await api('POST', '/api/course/reset', { token: tokens[role] })).status, 403, `${role} reset`);
  }
  assert.equal((await api('PUT', '/api/course', { token: tokens.admin, json: tree })).status, 200);
});

test('CMS save: new content, new content TYPE, extra fields all persist', async () => {
  const tree = (await api('GET', '/api/course', { token: tokens.admin })).data;
  tree.chapters[0].units[0].subtopics[0].assets.push({
    id: 'a-new-poll', order: 99, title: 'Class poll', type: 'poll', data: { options: ['a', 'b'] }, futureField: 42,
  });
  tree.chapters.push({ id: 'ch-new', order: 10, grade: '7', title: 'Brand new chapter', tags: ['x'], units: [] });
  assert.equal((await api('PUT', '/api/course', { token: tokens.admin, json: tree })).status, 200);
  const back = (await api('GET', '/api/course', { token: tokens.student })).data;
  const poll = back.chapters[0].units[0].subtopics[0].assets.find((a) => a.id === 'a-new-poll');
  assert.deepEqual(poll, { id: 'a-new-poll', order: 99, title: 'Class poll', type: 'poll', data: { options: ['a', 'b'] }, futureField: 42 });
  assert.equal(back.chapters.at(-1).id, 'ch-new');
});

test('CMS save validation: empty course, bad type, duplicate id, bad data', async () => {
  const t = tokens.admin;
  assert.equal((await api('PUT', '/api/course', { token: t, json: { chapters: [] } })).status, 400);
  assert.equal((await api('PUT', '/api/course', { token: t, json: { nope: 1 } })).status, 400);
  const mk = (asset) => ({ chapters: [{ id: 'c', title: 'c', units: [{ id: 'u', title: 'u', subtopics: [{ id: 's', title: 's', assets: asset }] }] }] });
  assert.equal((await api('PUT', '/api/course', { token: t, json: mk([{ id: 'a', title: 'a', type: 'Bad Type!', data: {} }]) })).status, 400);
  assert.equal((await api('PUT', '/api/course', { token: t, json: mk([{ id: 'a', title: 'a', type: 'video', data: {} }, { id: 'a', title: 'b', type: 'video', data: {} }]) })).status, 400);
  assert.equal((await api('PUT', '/api/course', { token: t, json: mk([{ id: 'a', title: 'a', type: 'video', data: 'str' }]) })).status, 400);
  // failed saves must not have damaged the stored course (transaction rolled back / never started)
  assert.ok((await api('GET', '/api/course', { token: t })).data.chapters.length >= 9);
});

test('course reset (admin) restores the seed', async () => {
  const r = await api('POST', '/api/course/reset', { token: tokens.admin });
  assert.equal(r.status, 200);
  assert.deepEqual((await api('GET', '/api/course', { token: tokens.admin })).data, readSeedCourse());
});

test('uploads: admin-only, type allow-list, size limit, then playable with Range support', async () => {
  const form = (bytes, type, name) => { const f = new FormData(); f.append('file', new Blob([bytes], { type }), name); return f; };
  const small = Buffer.alloc(200_000, 7);

  assert.equal((await api('POST', '/api/uploads', { body: form(small, 'video/mp4', 'a.mp4') })).status, 401);
  assert.equal((await api('POST', '/api/uploads', { token: tokens.student, body: form(small, 'video/mp4', 'a.mp4') })).status, 403);
  assert.equal((await api('POST', '/api/uploads', { token: tokens.admin, body: form(small, 'text/html', 'x.html') })).status, 415);
  assert.equal((await api('POST', '/api/uploads', { token: tokens.admin, json: {} })).status, 400);

  const big = await api('POST', '/api/uploads', { token: tokens.admin, body: form(Buffer.alloc(2_000_000, 1), 'video/mp4', 'big.mp4') });
  assert.equal(big.status, 413);
  assert.equal(fs.readdirSync(uploadsDir).length, 0, 'oversized upload must not leave a file behind');

  const ok = await api('POST', '/api/uploads', { token: tokens.admin, body: form(small, 'video/mp4', 'lesson.mp4') });
  assert.equal(ok.status, 201);
  assert.match(ok.data.url, /^\/api\/media\/[0-9a-f-]{36}\.mp4$/);
  assert.equal(ok.data.size, 200_000);

  const full = await fetch(base + ok.data.url);
  assert.equal(full.status, 200);
  assert.equal((await full.arrayBuffer()).byteLength, 200_000);
  const part = await fetch(base + ok.data.url, { headers: { range: 'bytes=0-99' } });
  assert.equal(part.status, 206, 'range requests work so the video can seek');
  assert.equal((await part.arrayBuffer()).byteLength, 100);

  assert.equal((await fetch(base + '/api/media/../../etc/passwd')).status, 404);
  assert.equal((await fetch(base + '/api/media/not-a-real-file.mp4')).status, 404);
});

test('tutor: needs login; calls Gemini with key + lesson context; stores the chat; keeps history', async () => {
  assert.equal((await api('POST', '/api/tutor/chat', { json: { message: 'hi' } })).status, 401);
  assert.equal((await api('POST', '/api/tutor/chat', { token: tokens.student, json: { message: '  ' } })).status, 400);

  const asset = 'ch1-u1-s1-a2'; // a summary asset in the seed
  const r1 = await api('POST', '/api/tutor/chat', { token: tokens.student, json: { sessionId: 's1', message: 'What is AI?', assetId: asset } });
  assert.equal(r1.status, 200);
  assert.equal(r1.data.reply, 'Stub owl says hi!');
  const call = geminiCalls.at(-1);
  assert.equal(call.key, 'stub-key');
  assert.ok(call.url.includes('/v1beta/models/stub-model:generateContent'));
  assert.match(call.body.systemInstruction.parts[0].text, /Professor Owl/);
  assert.match(call.body.systemInstruction.parts[0].text, /What is Artificial Intelligence/, 'lesson text is in the prompt');
  assert.match(call.body.systemInstruction.parts[0].text, /Grade 6/);
  assert.equal(call.body.contents.at(-1).parts[0].text, 'What is AI?');

  await api('POST', '/api/tutor/chat', { token: tokens.student, json: { sessionId: 's1', message: 'Give an example' } });
  const second = geminiCalls.at(-1).body.contents;
  assert.deepEqual(second.map((c) => c.role), ['user', 'model', 'user'], 'earlier turns come from the DB');

  const { rows } = await query("select role, content from tutor_messages m join tutor_sessions s on s.id = m.session_id where s.client_session_id = 's1' order by m.id");
  assert.deepEqual(rows.map((r) => r.role), ['user', 'assistant', 'user', 'assistant']);
});

test('tutor: quiz answers never reach the prompt', async () => {
  const { rows } = await query("select id, data from assets where type = 'quiz' limit 1");
  await api('POST', '/api/tutor/chat', { token: tokens.student, json: { sessionId: 'q', message: 'help', assetId: rows[0].id } });
  const sys = geminiCalls.at(-1).body.systemInstruction.parts[0].text;
  assert.ok(!/"correct"|explanation/i.test(sys));
  assert.match(sys, /Question:/);
});

test('tutor: upstream rate limit becomes a friendly 429, and nothing is stored', async () => {
  geminiMode = '429';
  const before = (await query('select count(*)::int n from tutor_messages')).rows[0].n;
  const r = await api('POST', '/api/tutor/chat', { token: tokens.student, json: { sessionId: 'z', message: 'hello' } });
  geminiMode = 'ok';
  assert.equal(r.status, 429);
  assert.equal((await query('select count(*)::int n from tutor_messages')).rows[0].n, before);
});

test('suspending a user kills their existing token immediately', async () => {
  await query("update users set status = 'suspended' where email = 'parent@futureminds.demo'");
  assert.equal((await api('GET', '/api/auth/me', { token: tokens.parent })).status, 401);
  assert.equal((await api('POST', '/api/auth/login', { json: { email: 'parent@futureminds.demo', password: 'pw-test-123' } })).status, 403);
});

test('forged / tampered tokens are rejected', async () => {
  assert.equal((await api('GET', '/api/auth/me', { token: tokens.student.slice(0, -3) + 'abc' })).status, 401);
  assert.equal((await api('GET', '/api/auth/me', { token: 'garbage' })).status, 401);
  assert.equal((await api('GET', '/api/nope')).status, 404);
});
