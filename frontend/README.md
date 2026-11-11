# FutureMinds frontend

React + Vite + Tailwind. See the repository root `README.md` for how to run the whole stack.

```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api to the backend on :3001)
npm run build      # outputs dist/ (index.html = landing page, app.html = the app)
```

The app talks to the backend through `src/lib/api.js`. Course content, login, the CMS and the AI tutor
all come from the API; student XP, assignments, teacher/parent/admin dashboards are still demo data.
