import { Router } from 'express';
import express from 'express';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { requireRole } from '../auth.js';
import { config } from '../config.js';
import { httpError } from '../errors.js';

const router = Router();

const unlockLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  keyGenerator: (req) => req.user.id,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many unlock attempts. Please wait a minute before trying again.' },
});

router.post('/unlock', ...requireRole('admin'), unlockLimiter, express.json({ limit: '5kb' }), (req, res) => {
  if (!config.cmsPassword) {
    throw httpError(503, 'CMS password is not configured on the server', 'cms_not_configured');
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password) {
    throw httpError(401, 'Incorrect CMS password');
  }

  const hashProvided = crypto.createHash('sha256').update(password).digest();
  const hashExpected = crypto.createHash('sha256').update(config.cmsPassword).digest();

  if (!crypto.timingSafeEqual(hashProvided, hashExpected)) {
    throw httpError(401, 'Incorrect CMS password');
  }

  const cmsToken = jwt.sign({ sub: req.user.id, cms: true }, config.jwtSecret, { expiresIn: '30m' });
  res.json({ cmsToken, expiresInSeconds: 1800 });
});

router.get('/status', ...requireRole('admin'), (req, res) => {
  const token = req.headers['x-cms-token'] || req.header('x-cms-token');
  if (!token) return res.json({ unlocked: false });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload && payload.cms === true && payload.sub === req.user?.id) {
      return res.json({ unlocked: true });
    }
  } catch {
    // expired or invalid
  }
  res.json({ unlocked: false });
});

export default router;
