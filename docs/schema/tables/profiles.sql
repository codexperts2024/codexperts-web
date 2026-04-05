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
