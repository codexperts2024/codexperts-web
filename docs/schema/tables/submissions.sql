
CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id BIGINT REFERENCES problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  score INTEGER,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
