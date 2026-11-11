import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The UI references images as /dist/assets/... (how it was hosted originally). Map that to / in dev.
const distAlias = {
  name: 'dist-alias',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url && req.url.startsWith('/dist/')) req.url = req.url.slice(5);
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), distAlias],
  server: {
    // In dev the API runs on :3001; same-origin /api calls are proxied so there is no CORS to configure.
    proxy: { '/api': 'http://localhost:3001' },
  },
  resolve: {
    alias: {
      'react-router-dom': path.resolve(__dirname, 'src/portals/nav.jsx'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // landing page
        app: path.resolve(__dirname, 'app.html'),    // React app
      },
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['lucide-react', '@phosphor-icons/react'],
        },
      },
    },
  },
});
