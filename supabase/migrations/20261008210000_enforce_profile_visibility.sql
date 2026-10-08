BEGIN;

-- Raw reads must not bypass per-field visibility, even through joins/filters.
REVOKE SELECT (company, occupation, linkedin, github, bio, profile_visibility)
  ON public.profiles FROM PUBLIC, anon, authenticated;

-- Always a viewer projection, including for owners. Editing uses get_own_profile.
-- Missing settings retain legacy public defaults; explicit false hides a value.
CREATE OR REPLACE FUNCTION public.get_visible_profiles()
RETURNS TABLE (
  id uuid, first_name text, last_name text, nickname text, avatar_url text,
  school text, company text, occupation text, status text, role text,
  linkedin text, github text, cohort text, bio text
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.id, p.first_name, p.last_name, p.nickname, p.avatar_url,
    p.school,
    CASE WHEN p.profile_visibility->'company' = 'false'::jsonb THEN NULL ELSE p.company END,
    CASE WHEN p.profile_visibility->'occupation' = 'false'::jsonb THEN NULL ELSE p.occupation END,
    p.status, p.role::text,
    CASE WHEN p.profile_visibility->'linkedin' = 'false'::jsonb THEN NULL ELSE p.linkedin END,
    CASE WHEN p.profile_visibility->'github' = 'false'::jsonb THEN NULL ELSE p.github END,
    p.cohort,
    CASE WHEN p.profile_visibility->'bio' = 'false'::jsonb THEN NULL ELSE p.bio END
  FROM public.profiles p
  WHERE p.role IN ('admin', 'executive')
    OR (p.role = 'member' AND public.get_my_role() IN ('member', 'executive', 'admin'));
$$;
REVOKE ALL ON FUNCTION public.get_visible_profiles() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_visible_profiles() TO anon, authenticated;

COMMIT;
