# FutureMinds

```
frontend/   React + Vite app (landing page + student/teacher/parent/admin portals)
backend/    Node (Express) API + Postgres schema. Also serves the built frontend in production.
Dockerfile  builds both into one image (this is what Railway runs)
```

## What is real vs. still demo

| Real (stored in Postgres / bucket) | Still demo data in the frontend |
|---|---|
| Login with 4 roles (student, teacher, parent, admin) | XP, streaks, rewards, badges |
| Course content: chapters → units → subtopics → assets | Assignments, announcements |
| **CMS**: admin-only, saves to the database | Teacher / parent / admin dashboards and charts |
| Video upload to a storage bucket | Student progress numbers |
| **AI tutor** (Gemini) with the current lesson as context | |
| **Chat history**, saved per student and synced across browsers | |

## Run locally

Needs Node 20+ and Docker (for Postgres only).

```bash
docker compose up -d                       # Postgres on :5432

cd backend
cp .env.example .env                       # then edit: JWT_SECRET, GEMINI_API_KEY, GEMINI_MODEL
npm install
npm run dev                                # API on :3001 (creates tables + demo data on first start)

# second terminal
cd frontend
npm install
npm run dev                                # http://localhost:5173
```

Open http://localhost:5173/app.html?view=role-select (or `/` for the landing page).
Always use port **5173** in development, not 3001.

**Demo accounts** (password = `SEED_PASSWORD`, `password123` if you did not change it):

| Role | Email |
|---|---|
| Admin | admin@futureminds.demo |
| Teacher | teacher@futureminds.demo |
| Student | student@futureminds.demo |
| Parent | parent@futureminds.demo |

Each role must use its own login screen; a student account cannot sign in through the admin screen.

## How the pieces work

**CMS is admin-only.** Sign in as admin → sidebar → **Content CMS**. Edits are saved to Postgres
(`PUT /api/course`). The server refuses that call for every other role, so hiding the menu is only cosmetic:
even if a student opens the CMS screen, saving fails with *403*. "Reset to defaults" is a server action too.

**Videos.** In the CMS, open a video asset → *Choose video file* (MP4 or WebM). The file streams through the API
into the bucket and the asset stores a stable link like `/api/media/<id>.mp4`. When a student plays it, the API
redirects to a short-lived signed bucket URL, so seeking works and the API never serves the video bytes.
YouTube / Vimeo links still work (paste the URL). Locally, with no bucket configured, files go to `backend/uploads/`.
Max size: `MAX_UPLOAD_MB` (default 300).

**AI tutor.** The browser sends the question to `POST /api/tutor/chat`; the server adds a system prompt
(friendly tutor for grades 6–8) plus the lesson the student is viewing, calls Gemini, and stores the exchange.
The Gemini key lives only on the server. Quiz answers are never put in the prompt.
- Limit: 15 questions/min/user.
- Gemini request timeout: 25 seconds.
- Thinking is set to `low` to keep replies fast.

**Chat history sync.** Conversations are stored in Postgres and loaded when the AI Tutor opens, so they survive
clearing the browser or switching devices. Each student can only see their own chats.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/tutor/sessions` | List the user's sessions (newest first, max 50) |
| GET | `/api/tutor/sessions/:id/messages` | Messages of one session (404 if not the user's) |
| DELETE | `/api/tutor/sessions/:id` | Delete one of the user's sessions |

## Choosing a Gemini model

Model names change and old ones are retired for new accounts (`gemini-2.5-flash` now returns 404 for new keys).
List what your key can use:

```bash
curl -H "x-goog-api-key: YOUR_KEY" "https://generativelanguage.googleapis.com/v1beta/models"
```

Pick a model whose `supportedGenerationMethods` includes `generateContent`. We tested these for speed with a
short tutor question:

| Model | Result |
|---|---|
| `gemini-3.1-flash-lite` | about 2 seconds, **recommended** |
| `gemini-3.5-flash-lite` | about 3 to 4 seconds |
| `gemini-3.5-flash` | about 6 seconds, one "high demand" 503 |
| `gemini-3.8-flash` | 30 to 60 seconds, too slow for a tutor |

Set it with `GEMINI_MODEL=gemini-3.1-flash-lite` (no `models/` prefix).

## Deploy on Railway

1. Push this repo to GitHub.
2. Railway → **New Project → Deploy from GitHub repo**. It detects the `Dockerfile` (leave root directory as `/`).
3. In the project: **+ New → Database → PostgreSQL**.
4. **+ New → Bucket** (any region). Railway buckets are private S3-compatible storage.
5. Open your app service → **Variables** and add (replace `Postgres` / `Bucket` with your service names if different):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
   | `S3_BUCKET` | `${{Bucket.BUCKET}}` |
   | `S3_ENDPOINT` | `${{Bucket.ENDPOINT}}` |
   | `S3_REGION` | `${{Bucket.REGION}}` |
   | `S3_ACCESS_KEY_ID` | `${{Bucket.ACCESS_KEY_ID}}` |
   | `S3_SECRET_ACCESS_KEY` | `${{Bucket.SECRET_ACCESS_KEY}}` |
   | `JWT_SECRET` | a long random string (`openssl rand -hex 32`) |
   | `SEED_PASSWORD` | the password for the 4 demo accounts. **Set this before the first deploy** |
   | `GEMINI_API_KEY` | from https://aistudio.google.com/apikey |
   | `GEMINI_MODEL` | `gemini-3.1-flash-lite` (or any current fast Flash model) |

   If video uploads fail with a signature / host error, check the bucket's **Credentials** tab: older buckets
   use path-style URLs, in which case also set `S3_FORCE_PATH_STYLE=true`.
6. **Settings → Networking → Generate Domain**, then open it.

On first boot the API creates the tables and loads the demo users and the built-in course into the empty database.
`SEED_PASSWORD` only applies at that moment. To change a password later, run this from your machine with
`DATABASE_URL` set to the Railway Postgres **public** URL and `DATABASE_SSL=true`:

```bash
cd backend && npm run set-password -- admin@futureminds.demo 'a-new-password'
```

## Tests

```bash
cd backend
TEST_DATABASE_URL=postgres://postgres:postgres@localhost:5432/fm_test npm test   # WIPES that database's public schema
```

Covers: role-based access (only admin can write the CMS), login rules, lossless course storage, upload limits and
Range requests, tutor prompt/history/rate-limit handling (Gemini is stubbed), suspended-user lockout.
The chat history sync routes were tested by hand, not by automated tests.

## Known limitations (demo scope)

- **Grade filtering happens in the browser.** `GET /api/course` sends every grade's content, including locked
  chapters, to every logged-in student. Filter by grade on the server before using this with real students.
- The CMS saves the whole course in one request (last write wins). Two admins editing at once can overwrite each other.
- `/api/media/<id>` links are public to anyone who has the link (names are unguessable UUIDs). Needed because `<video>` can't send auth headers.
- Without a bucket, uploads go to local disk (`backend/uploads/`), which most hosts wipe on redeploy. Configure the bucket in production.
- Deleting a video asset does not delete its file from the bucket.
- No self-signup or "forgot password"; accounts are created by seed / SQL.
- All four demo accounts share one password. Change `SEED_PASSWORD` before going live.
- If Gemini is overloaded (503) or rate-limited (429), the student sees a friendly error. There is no automatic retry or fallback model yet.
- Free Gemini tier: rate-limited, and Google may use free-tier data to improve its products. Only the student's grade,
  the question and the lesson text are sent (no names). Do not use real student data on the free tier.
- The Helmet CSP header is disabled because the landing page uses inline scripts and lessons embed YouTube/Vimeo.