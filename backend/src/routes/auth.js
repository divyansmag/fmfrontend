import { Router } from 'express';
import express from 'express';
import bcrypt from 'bcryptjs';
import { rateLimit } from 'express-rate-limit';
import { publicUser, requireAuth, signToken } from '../auth.js';
import { query } from '../db.js';
import { httpError } from '../errors.js';

const router = Router();
// A hash nobody can match, so unknown emails cost the same time as wrong passwords.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

const loginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Wait a minute and try again.' },
});

router.post('/login', loginLimiter, express.json({ limit: '10kb' }), async (req, res) => {
  const { email, password, role } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    throw httpError(400, 'Email and password are required');
  }
  const { rows } = await query('select * from users where lower(email) = lower($1)', [email.trim()]);
  const user = rows[0];
  const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !ok) throw httpError(401, 'Incorrect email or password');
  if (user.status !== 'active') throw httpError(403, 'This account is suspended');
  // The portal the person clicked (student/teacher/parent/admin) must match their real role.
  if (role && role !== user.role) throw httpError(403, `This account is not a ${role} account. Use the ${user.role} login instead.`);
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export default router;
