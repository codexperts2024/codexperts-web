
CREATE TABLE attendances (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES sessions(id) ON DELETE CASCADE,
  checked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (profile_id, session_id)
);


