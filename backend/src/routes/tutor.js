import { Router } from 'express';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { requireAuth } from '../auth.js';
import { lessonContext } from '../courseStore.js';
import { query } from '../db.js';
import { httpError } from '../errors.js';
import { generate } from '../gemini.js';

const router = Router();

const limiter = rateLimit({
  windowMs: 60_000,
  limit: 15,
  keyGenerator: (req) => req.user.id,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down a little, Professor Owl needs a breath! Try again in a minute.' },
});

export function buildSystemPrompt(user, lesson) {
  const grade = user.grade ? ` The student is in Grade ${user.grade}.` : '';
  let p =
    'You are Professor Owl, a friendly AI tutor inside FutureMinds, an AI-literacy course for students in grades 6 to 8 (ages 11 to 14).' + grade +
    ' Explain ideas simply, with short paragraphs and concrete everyday examples. Be warm and encouraging.' +
    ' If asked for homework or quiz answers, give hints and guide step by step before revealing a full answer.' +
    ' Stay on topic: AI, machine learning, coding, maths and the course lessons. Gently steer back if the student drifts.' +
    ' Never ask for personal information. If a student shares something worrying (feeling unsafe, self-harm, abuse), respond kindly and encourage them to talk to a trusted adult or their teacher right away.' +
    ' Keep replies under about 150 words unless asked for more. Use plain text; at most simple bullet points.';
  if (lesson) {
    p += `\n\nThe student is currently viewing this lesson: ${lesson.heading}\nLesson content (use it when relevant, do not recite it):\n"""\n${lesson.text}\n"""`;
  }
  return p;
}

router.post('/chat', requireAuth, limiter, express.json({ limit: '20kb' }), async (req, res) => {
  const body = req.body || {};
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) throw httpError(400, 'Message is required');
  if (message.length > 2000) throw httpError(400, 'Message is too long (max 2000 characters)');
  const clientSessionId = String(body.sessionId ?? 'default').slice(0, 64);

  const {
    rows: [session],
  } = await query(
    `insert into tutor_sessions (user_id, client_session_id, title) values ($1, $2, $3)
     on conflict (user_id, client_session_id) do update set updated_at = now()
     returning id`,
    [req.user.id, clientSessionId, message.slice(0, 60)]
  );

  // History comes from our own database, not from the browser, so it can't be forged.
  const { rows: history } = await query(
    `select role, content from (
       select id, role, content from tutor_messages where session_id = $1 order by id desc limit 12
     ) t order by id`,
    [session.id]
  );

  const lesson = body.assetId ? await lessonContext(String(body.assetId)).catch(() => null) : null;

  const reply = await generate({
    system: buildSystemPrompt(req.user, lesson),
    messages: [
      ...history.map((h) => ({ role: h.role === 'assistant' ? 'model' : 'user', text: h.content })),
      { role: 'user', text: message },
    ],
  });

  // Only store the exchange once we actually have an answer, so the log never has dangling questions.
  await query(
    `insert into tutor_messages (session_id, role, content)
     select $1, r, c from unnest($2::text[], $3::text[]) as t(r, c)`,
    [session.id, ['user', 'assistant'], [message, reply]]
  );

  res.json({ reply });
});

router.get('/sessions', requireAuth, async (req, res) => {
  const { rows } = await query(
    `select client_session_id as id, title, updated_at as "updatedAt"
     from tutor_sessions
     where user_id = $1
     order by updated_at desc
     limit 50`,
    [req.user.id]
  );
  res.json(rows);
});

router.get('/sessions/:clientSessionId/messages', requireAuth, async (req, res) => {
  const { rows: sessions } = await query(
    'select id from tutor_sessions where user_id = $1 and client_session_id = $2',
    [req.user.id, req.params.clientSessionId]
  );
  if (!sessions.length) throw httpError(404, 'Session not found');

  const { rows: messages } = await query(
    `select role, content, created_at as "createdAt"
     from tutor_messages
     where session_id = $1
     order by id asc`,
    [sessions[0].id]
  );
  res.json(messages);
});

router.delete('/sessions/:clientSessionId', requireAuth, async (req, res) => {
  const { rowCount } = await query(
    'delete from tutor_sessions where user_id = $1 and client_session_id = $2',
    [req.user.id, req.params.clientSessionId]
  );
  if (!rowCount) throw httpError(404, 'Session not found');
  res.json({ ok: true });
});

export default router;
