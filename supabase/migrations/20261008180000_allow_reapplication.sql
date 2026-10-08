BEGIN;

-- Permit validated resubmission while preserving every rejection record.
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
    IF (OLD.role = 'pending' AND OLD.application_status IN ('draft', 'rejected')
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
  IF OLD.role <> 'pending' THEN
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
  IF applicant.role <> 'pending' OR applicant.application_status NOT IN ('draft', 'pending', 'rejected') THEN
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

COMMIT;
