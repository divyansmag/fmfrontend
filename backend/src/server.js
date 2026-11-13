import { createApp } from './app.js';
import { config } from './config.js';
import { migrate, pool, seedIfEmpty } from './db.js';
import { replaceTree } from './courseStore.js';

async function main() {
  await migrate();
  if (config.autoSeed) {
    await seedIfEmpty(replaceTree);
    if (config.isProd && config.seedPassword === 'password123') {
      console.warn('[security] demo accounts use the default password. Set SEED_PASSWORD before first deploy.');
    }
  }
  const server = createApp().listen(config.port, () => console.log(`[api] listening on :${config.port}`));
  const stop = () => server.close(() => pool.end().then(() => process.exit(0)));
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}

main().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});
