BEGIN;

-- RLS chooses rows; column privileges independently prevent contact disclosure,
-- including through public executive reads, joins, filters, and ordering.
REVOKE SELECT ON public.profiles FROM PUBLIC, anon, authenticated;
DO $$
DECLARE column_list text;
BEGIN
  SELECT string_agg(quote_ident(attname), ', ') INTO column_list
  FROM pg_attribute
  WHERE attrelid = 'public.profiles'::regclass AND attnum > 0 AND NOT attisdropped;
  EXECUTE format('REVOKE SELECT (%s) ON public.profiles FROM PUBLIC, anon, authenticated', column_list);
END $$;

GRANT SELECT (
  id, first_name, last_name, nickname, avatar_url, school, company,
  occupation, status, role, linkedin, github, cohort, bio, profile_visibility,
  major, discord_joined, application_status, created_at, updated_at
) ON public.profiles TO anon, authenticated;

-- No caller-supplied identity: only the logged-in owner's full profile.
CREATE OR REPLACE FUNCTION public.get_own_profile()
RETURNS SETOF public.profiles
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.* FROM public.profiles p WHERE p.id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.get_own_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_own_profile() TO authenticated;

-- Administrative APIs authorize reviewers before using this server-only role.
GRANT SELECT ON public.profiles TO service_role;

COMMIT;
