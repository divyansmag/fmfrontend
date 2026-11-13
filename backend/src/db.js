import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { config } from './config.js';

const here = path.dirname(fileURLToPath(import.meta.url));

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
  max: 10,
});
pool.on('error', (err) => console.error('[pg] idle client error', err.message));

export const query = (text, params) => pool.query(text, params);

export async function migrate() {
  const sql = fs.readFileSync(path.resolve(here, '..', 'db', 'schema.sql'), 'utf8');
  await pool.query(sql);
}

export function readSeedCourse() {
  const raw = JSON.parse(fs.readFileSync(path.resolve(here, '..', 'seed', 'course.json'), 'utf8'));
  return { ...raw, chapters: (raw.chapters || []).filter(Boolean) };
}

/** Creates the four demo accounts and the built-in course, but only into an empty database. */
export async function seedIfEmpty(replaceCourse) {
  const { rows: u } = await query('select count(*)::int as n from users');
  if (u[0].n === 0) {
    const hash = await bcrypt.hash(config.seedPassword, 10);
    const demo = [
      ['admin@futureminds.demo', 'System Admin', 'admin', null],
      ['teacher@futureminds.demo', 'Anaya Sharma', 'teacher', null],
      ['student@futureminds.demo', 'Divya N', 'student', '6'],
      ['parent@futureminds.demo', 'Priya Sharma', 'parent', null],
    ];
    for (const [email, name, role, grade] of demo) {
      await query(
        'insert into users (email, password_hash, full_name, role, grade) values ($1,$2,$3,$4,$5)',
        [email, hash, name, role, grade]
      );
    }
    console.log('[seed] created demo users (password from SEED_PASSWORD)');
  }
  const { rows: c } = await query('select count(*)::int as n from chapters');
  if (c[0].n === 0) {
    await replaceCourse(readSeedCourse());
    console.log('[seed] loaded built-in course');
  }
}
