BEGIN;

-- Make phone optional in both onboarding validation layers.
CREATE OR REPLACE FUNCTION public.protect_profiles_admin_columns()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(auth.jwt() ->> 'role', '') = 'service_role'
    OR public.get_my_role() = 'admin'::public.member_role THEN
    RETURN NEW;
  END IF;
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Cannot change role' USING ERRCODE = '42501';
  END IF;
  IF NEW.application_status IS DISTINCT FROM OLD.application_status THEN
    IF (OLD.role = 'pending' AND OLD.application_status = 'draft'
      AND NEW.application_status = 'pending'
      AND nullif(btrim(NEW.first_name), '') IS NOT NULL
      AND nullif(btrim(NEW.last_name), '') IS NOT NULL
      AND NEW.school IN ('Seneca College', 'York University')
      AND coalesce(NEW.cohort, '') ~ '^[1-9][0-9]*$'
      AND (nullif(btrim(NEW.phone), '') IS NULL OR NEW.phone ~ '^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$')
      AND NEW.status IN ('student', 'graduate')
      AND nullif(btrim(NEW.major), '') IS NOT NULL) IS NOT TRUE THEN
      RAISE EXCEPTION 'Complete all required application fields before submitting' USING ERRCODE = '42501';
    END IF;
  END IF;
  IF NEW.email IS DISTINCT FROM OLD.email OR NEW.avatar_url IS DISTINCT FROM OLD.avatar_url THEN
    RAISE EXCEPTION 'Cannot change Google identity fields' USING ERRCODE = '42501';
  END IF;
  IF OLD.role <> 'pending' OR OLD.application_status = 'rejected' THEN
    IF NEW.first_name IS DISTINCT FROM OLD.first_name
      OR NEW.last_name IS DISTINCT FROM OLD.last_name
      OR NEW.cohort IS DISTINCT FROM OLD.cohort THEN
      RAISE EXCEPTION 'Name and cohort changes require an administrator' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Authenticated users can submit only their own application. The transaction
-- creates a missing profile, locks it, validates it, and submits it atomically.
CREATE OR REPLACE FUNCTION public.submit_application(fields jsonb)
RETURNS public.profiles LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  applicant public.profiles;
  caller uuid := auth.uid();
BEGIN
  IF caller IS NULL THEN RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501'; END IF;
  IF jsonb_typeof(fields) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid application';
  END IF;
  IF nullif(btrim(fields->>'first_name'), '') IS NULL
    OR nullif(btrim(fields->>'last_name'), '') IS NULL
    OR coalesce(fields->>'school', '') NOT IN ('Seneca College', 'York University')
    OR coalesce(fields->>'cohort', '') !~ '^[1-9][0-9]*$'
    OR (nullif(btrim(fields->>'phone'), '') IS NOT NULL AND fields->>'phone' !~ '^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$')
    OR coalesce(fields->>'status', '') NOT IN ('student', 'graduate')
    OR nullif(btrim(fields->>'major'), '') IS NULL
    OR length(fields->>'major') > 120
    OR jsonb_typeof(fields->'discord_joined') IS DISTINCT FROM 'boolean' THEN
    RAISE EXCEPTION 'Complete all required application fields';
  END IF;

  INSERT INTO public.profiles (id, email, avatar_url, role, application_status)
    SELECT id, email, raw_user_meta_data->>'avatar_url', 'pending', 'draft'
    FROM auth.users WHERE id = caller
    ON CONFLICT (id) DO NOTHING;
  SELECT * INTO applicant FROM public.profiles WHERE id = caller FOR UPDATE;
  IF applicant.role <> 'pending' OR applicant.application_status NOT IN ('draft', 'pending') THEN
    RAISE EXCEPTION 'This application cannot be submitted' USING ERRCODE = '42501';
  END IF;
  UPDATE public.profiles SET
    first_name = btrim(fields->>'first_name'), last_name = btrim(fields->>'last_name'),
    nickname = nullif(btrim(fields->>'nickname'), ''), school = fields->>'school',
    cohort = fields->>'cohort', phone = nullif(btrim(fields->>'phone'), ''), status = fields->>'status',
    major = btrim(fields->>'major'), discord_joined = (fields->>'discord_joined')::boolean,
    company = nullif(btrim(fields->>'company'), ''), occupation = nullif(btrim(fields->>'occupation'), ''),
    linkedin = nullif(fields->>'linkedin', ''), github = nullif(fields->>'github', ''),
    application_status = 'pending'
  WHERE id = caller RETURNING * INTO applicant;
  RETURN applicant;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_application(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application(jsonb) TO authenticated;

-- Rejection reasons are private to the applicant and reviewers, not the member directory.
CREATE TABLE public.application_rejections (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (length(btrim(reason)) BETWEEN 1 AND 1000),
  rejected_at timestamptz NOT NULL DEFAULT now(),
  rejected_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);
CREATE INDEX application_rejections_profile_date_idx
  ON public.application_rejections(profile_id, rejected_at DESC, id DESC);
ALTER TABLE public.application_rejections ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.application_rejections FROM anon, authenticated;
GRANT SELECT ON public.application_rejections TO authenticated;
GRANT ALL ON public.application_rejections TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.application_rejections_id_seq TO service_role;
CREATE POLICY application_rejections_read_self_or_reviewer
  ON public.application_rejections FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR public.get_my_role() IN ('admin', 'executive'));

-- State change and its reason must either both commit or both fail.
-- Only the verified server-side Admin API may call this function.
CREATE OR REPLACE FUNCTION public.reject_application(applicant_id uuid, reviewer_id uuid, rejection_reason text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  applicant public.profiles;
  decision public.application_rejections;
BEGIN
  IF coalesce(auth.jwt()->>'role', '') <> 'service_role' THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;
  IF nullif(btrim(rejection_reason), '') IS NULL OR length(btrim(rejection_reason)) > 1000 THEN
    RAISE EXCEPTION 'A rejection reason of 1 to 1000 characters is required' USING ERRCODE = '22023';
  END IF;
  PERFORM 1 FROM public.profiles WHERE id = reviewer_id AND role IN ('admin', 'executive') FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501'; END IF;
  SELECT * INTO applicant FROM public.profiles WHERE id = applicant_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Applicant not found' USING ERRCODE = 'P0002'; END IF;
  IF applicant.role <> 'pending' OR applicant.application_status <> 'pending' THEN
    RAISE EXCEPTION 'Application is no longer pending review' USING ERRCODE = '22023';
  END IF;
  UPDATE public.profiles SET application_status = 'rejected' WHERE id = applicant_id RETURNING * INTO applicant;
  INSERT INTO public.application_rejections(profile_id, reason, rejected_by)
    VALUES (applicant_id, btrim(rejection_reason), reviewer_id) RETURNING * INTO decision;
  RETURN to_jsonb(applicant) || jsonb_build_object('rejection_reason', decision.reason, 'rejected_at', decision.rejected_at);
END;
$$;
REVOKE ALL ON FUNCTION public.reject_application(uuid, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reject_application(uuid, uuid, text) TO service_role;

-- Earlier decisions have no recorded reason/date. Do not invent historical data.
COMMIT;
