import fs from 'node:fs';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { config } from './config.js';
import { pool } from './db.js';
import { HttpError } from './errors.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/course.js';
import tutorRoutes from './routes/tutor.js';
import uploadRoutes, { serveMedia } from './routes/uploads.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // Railway sits behind a proxy; needed for correct client IPs in rate limits
  app.disable('x-powered-by');

  // CSP is off because the landing page uses inline scripts and the lessons embed YouTube / Vimeo iframes.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  if (config.corsOrigins.length) app.use(cors({ origin: config.corsOrigins }));

  app.get('/api/health', async (_req, res) => {
    await pool.query('select 1');
    res.json({ ok: true });
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/course', courseRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.get('/api/media/:name', serveMedia);
  app.use('/api/tutor', tutorRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

  // In production this one server also serves the built frontend (landing page + app).
  const dist = config.frontendDirs.find((d) => fs.existsSync(`${d}/app.html`));
  if (dist) {
    // HTML names the hashed JS chunks, so it must never be cached; if it is, a rebuild leaves browsers
    // asking for chunk files that no longer exist (blank page). Hashed assets are safe to cache for a year.
    const staticOpts = {
      index: 'index.html',
      setHeaders(res, filePath) {
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
        else if (/[\\/]assets[\\/].+-[A-Za-z0-9_-]{8}\.[a-z0-9]+$/i.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        else res.setHeader('Cache-Control', 'public, max-age=3600');
      },
    };
    app.use(express.static(dist, staticOpts));
    // The frontend references images as /dist/assets/... (how it was hosted before); alias it.
    app.use('/dist', express.static(dist, staticOpts));
    console.log(`[web] serving frontend from ${dist}`);
  }

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large' });
    if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
    console.error('[error]', err);
    res.status(500).json({ error: config.isProd ? 'Something went wrong' : String(err.message || err) });
  });
  return app;
}
