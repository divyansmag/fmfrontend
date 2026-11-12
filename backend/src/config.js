import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const env = process.env;
const isProd = env.NODE_ENV === 'production';

if (!env.DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}
if (isProd && !env.JWT_SECRET) {
  console.error('JWT_SECRET is required in production');
  process.exit(1);
}

export const config = {
  isProd,
  port: Number(env.PORT || 3001),
  databaseUrl: env.DATABASE_URL,
  databaseSsl: env.DATABASE_SSL === 'true',
  cmsPassword: env.CMS_PASSWORD || '',
  jwtSecret: env.JWT_SECRET || 'dev-only-secret-do-not-use-in-production',
  corsOrigins: (env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean),
  seedPassword: env.SEED_PASSWORD || 'password123',
  autoSeed: env.AUTO_SEED !== 'false',
  maxUploadBytes: Number(env.MAX_UPLOAD_MB || 300) * 1024 * 1024,
  uploadsDir: path.resolve(here, '..', 'uploads'),
  // Docker build copies the built frontend to backend/public; locally we serve ../frontend/dist if it exists.
  frontendDirs: [env.FRONTEND_DIR, path.resolve(here, '..', 'public'), path.resolve(here, '..', '..', 'frontend', 'dist')].filter(Boolean),
  s3: {
    bucket: env.S3_BUCKET || '',
    endpoint: env.S3_ENDPOINT || undefined,
    region: env.S3_REGION || 'auto',
    accessKeyId: env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
    forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true',
  },
  gemini: {
    apiKey: env.GEMINI_API_KEY || '',
    model: env.GEMINI_MODEL || 'gemini-2.5-flash',
    baseUrl: (env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com').replace(/\/$/, ''),
  },
};
