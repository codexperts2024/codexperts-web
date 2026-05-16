CREATE SCHEMA IF NOT EXISTS public;
SET search_path TO public;

CREATE TYPE ROLE AS ENUM ('pending', 'member', 'executive', 'admin');

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role ROLE NOT NULL DEFAULT 'pending',
  school TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problems (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL, -- Title of the problem
  description TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  expires_time TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '2 hours',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id BIGINT REFERENCES problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  ai_feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attendances (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES sessions(id) ON DELETE CASCADE,
  checked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (profile_id, session_id)
);


