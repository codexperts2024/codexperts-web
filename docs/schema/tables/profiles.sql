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
