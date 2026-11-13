-- FutureMinds demo backend schema. Idempotent: safe to run on every boot.
--
-- Authorisation is enforced in the API (src/auth.js), not with Postgres RLS:
-- the browser never talks to Postgres directly, only to this API.

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  password_hash text not null,
  full_name     text not null,
  role          text not null check (role in ('student', 'teacher', 'parent', 'admin')),
  status        text not null default 'active' check (status in ('active', 'suspended')),
  grade         text,                                  -- students only: '6' | '7' | '8'
  created_at    timestamptz not null default now()
);
create unique index if not exists users_email_lower_idx on users (lower(email));

-- Course content: Chapter > Unit > Subtopic > Asset.
-- IDs are text so existing ids ('ch1-u1-s1-a1') and CMS-generated ids ('a-1731-x7k') both work.
create table if not exists chapters (
  id         text primary key,
  position   integer not null default 0,      -- exact array order as the CMS sent it (`order` restarts per grade)
  sort_order integer not null default 0,
  grade      text not null default '6',
  number     text,
  title      text not null,
  status     text,
  tags       text[] not null default '{}',
  extra      jsonb not null default '{}'::jsonb,       -- any field the CMS adds later round-trips here
  updated_at timestamptz not null default now()
);

create table if not exists units (
  id         text primary key,
  chapter_id text not null references chapters (id) on delete cascade,
  position   integer not null default 0,
  sort_order integer not null default 0,
  grade      text,
  title      text not null,
  extra      jsonb not null default '{}'::jsonb
);
create index if not exists units_chapter_idx on units (chapter_id, position);

create table if not exists subtopics (
  id         text primary key,
  unit_id    text not null references units (id) on delete cascade,
  position   integer not null default 0,
  sort_order integer not null default 0,
  grade      text,
  title      text not null,
  extra      jsonb not null default '{}'::jsonb
);
create index if not exists subtopics_unit_idx on subtopics (unit_id, position);

create table if not exists assets (
  id          text primary key,
  subtopic_id text not null references subtopics (id) on delete cascade,
  position    integer not null default 0,
  sort_order  integer not null default 0,
  grade       text,
  title       text not null,
  -- video | summary | mindmap | quiz | flashcards | lab | game | (anything new: no migration)
  type        text not null check (type ~ '^[a-z][a-z0-9_]*$'),
  data        jsonb not null default '{}'::jsonb,
  extra       jsonb not null default '{}'::jsonb
);
create index if not exists assets_subtopic_idx on assets (subtopic_id, position);

-- AI tutor chat log. client_session_id is the id the frontend uses for its own chat tabs.
create table if not exists tutor_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references users (id) on delete cascade,
  client_session_id text not null,
  title             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, client_session_id)
);

create table if not exists tutor_messages (
  id         bigint generated always as identity primary key,
  session_id uuid not null references tutor_sessions (id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  created_at timestamptz not null default now()
);
create index if not exists tutor_messages_session_idx on tutor_messages (session_id, id);
