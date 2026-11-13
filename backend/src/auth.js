import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { query } from './db.js';
import { httpError } from './errors.js';

export const signToken = (user) =>
  jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: '7d' });

export const publicUser = (u) => ({
  id: u.id,
  name: u.full_name,
  email: u.email,
  role: u.role,
  grade: u.grade,
});

/** Verifies the bearer token AND re-reads the user, so suspending/demoting someone takes effect immediately. */
export async function requireAuth(req, _res, next) {
  try {
    const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
    if (!m) throw httpError(401, 'Not signed in');
    let payload;
    try {
      payload = jwt.verify(m[1], config.jwtSecret);
    } catch {
      throw httpError(401, 'Session expired, please sign in again');
    }
    const { rows } = await query(
      'select id, email, full_name, role, grade, status from users where id = $1',
      [payload.sub]
    );
    const user = rows[0];
    if (!user || user.status !== 'active') throw httpError(401, 'Account unavailable');
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export const requireRole = (...roles) => [
  requireAuth,
  (req, _res, next) =>
    roles.includes(req.user.role) ? next() : next(httpError(403, 'You do not have permission to do that')),
];

export function requireCmsUnlock(req, _res, next) {
  const token = req.headers['x-cms-token'] || (typeof req.header === 'function' ? req.header('x-cms-token') : null);
  if (!token) return next(httpError(403, 'CMS is locked. Enter the CMS password.', 'cms_locked'));
  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    return next(httpError(403, 'CMS is locked. Enter the CMS password.', 'cms_locked'));
  }
  if (!payload || payload.cms !== true || payload.sub !== req.user?.id) {
    return next(httpError(403, 'CMS is locked. Enter the CMS password.', 'cms_locked'));
  }
  next();
}
