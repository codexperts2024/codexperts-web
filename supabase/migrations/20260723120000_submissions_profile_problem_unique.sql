-- One submission per member per problem (upsert target for POST /submissions).
CREATE UNIQUE INDEX IF NOT EXISTS submissions_profile_id_problem_id_uidx
ON public.submissions (profile_id, problem_id);
