
CREATE TABLE submissions (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id BIGINT REFERENCES problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  ai_feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
