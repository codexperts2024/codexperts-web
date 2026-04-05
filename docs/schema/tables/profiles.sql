CREATE TYPE ROLE AS ENUM ('pending', 'member', 'executive', 'admin');
CREATE TYPE SCHOOL AS ENUM ('Seneca Polythenic', 'York University');

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role ROLE NOT NULL DEFAULT 'pending',
  school SCHOOL NOT NULL,
  linkedin TEXT,
  github TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendances (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES sessions(id) ON DELETE CASCADE,
  present BOOL NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
