import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import Busboy from 'busboy';
import { requireRole } from '../auth.js';
import { config } from '../config.js';
import { httpError } from '../errors.js';
import { sizeLimiter, storage } from '../storage.js';

const router = Router();

const MIME_EXT = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
};
export const MEDIA_NAME = /^[A-Za-z0-9-]+\.(mp4|webm|png|jpg|webp|gif|pdf)$/;

// Admin-only. The file is streamed straight through to storage (never buffered in memory or put in Postgres).
// Returns a stable URL to store in asset.data.url, e.g. { url: '/api/media/<uuid>.mp4' }.
router.post('/', ...requireRole('admin'), (req, res, next) => {
  if (!String(req.headers['content-type'] || '').startsWith('multipart/form-data')) {
    return next(httpError(400, 'Send multipart/form-data with a "file" field'));
  }
  if (Number(req.headers['content-length'] || 0) > config.maxUploadBytes + 1_000_000) {
    return next(httpError(413, `File too large (max ${Math.round(config.maxUploadBytes / 1048576)} MB)`));
  }

  const bb = Busboy({ headers: req.headers, limits: { files: 1 } });
  let started = false;
  let done = false;
  const fail = (err) => {
    if (done) return;
    done = true;
    req.unpipe(bb);
    req.resume();
    res.set('Connection', 'close');
    next(err);
  };

  bb.on('file', (_field, stream, info) => {
    started = true;
    const mime = String(info.mimeType || '').toLowerCase();
    const ext = MIME_EXT[mime];
    if (!ext) {
      stream.resume();
      return fail(httpError(415, 'Unsupported file type. Allowed: MP4, WebM, PNG, JPG, WebP, GIF, PDF.'));
    }
    const name = `${randomUUID()}${ext}`;
    const key = `uploads/${name}`;
    const limiter = sizeLimiter(config.maxUploadBytes);
    stream.on('error', (e) => limiter.destroy(e));
    storage
      .put(key, stream.pipe(limiter), mime)
      .then(() => {
        if (done) return;
        done = true;
        res.status(201).json({ url: `/api/media/${name}`, key, size: limiter.bytes, contentType: mime, name: info.filename });
      })
      .catch((err) => {
        storage.remove(key).catch(() => {});
        fail(err.status ? err : httpError(500, 'Upload failed'));
      });
  });
  bb.on('error', fail);
  bb.on('close', () => {
    if (!started) fail(httpError(400, 'No file received'));
  });
  req.pipe(bb);
});

// Public on purpose: <video> tags can't send an Authorization header. Names are unguessable UUIDs.
export async function serveMedia(req, res) {
  const { name } = req.params;
  if (!MEDIA_NAME.test(name)) throw httpError(404, 'Not found');
  if (storage.kind === 's3') {
    res.set('Cache-Control', 'private, max-age=300');
    return res.redirect(302, await storage.signedUrl(`uploads/${name}`));
  }
  res.sendFile(storage.localPath(`uploads/${name}`), { dotfiles: 'deny', maxAge: '1h' }, (err) => {
    if (err && !res.headersSent) res.status(404).json({ error: 'Not found' });
  });
}

export default router;
