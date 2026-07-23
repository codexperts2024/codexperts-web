-- Sample stdin/stdout pairs for Solutions Run pass/fail checks (max 10 enforced in app).
ALTER TABLE public.problems
  ADD COLUMN IF NOT EXISTS sample_tests JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.problems.sample_tests IS
  'Ordered sample I/O pairs: [{ "stdin": string, "expected_stdout": string }, ...]';
