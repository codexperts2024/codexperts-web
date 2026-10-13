BEGIN;

-- Fail rather than silently rewrite historical assignments if legacy duplicates exist.
CREATE UNIQUE INDEX executive_roles_active_user_idx ON public.executive_roles(user_id)
  WHERE end_date IS NULL;

CREATE OR REPLACE FUNCTION public.admin_edit_member(
  actor_id uuid, target_id uuid, fields jsonb,
  set_title boolean DEFAULT false, requested_title text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  old_profile public.profiles;
  next_profile public.profiles;
  current_title public.executive_roles;
  next_title public.executive_title;
  complete_application boolean;
BEGIN
  IF coalesce(auth.jwt()->>'role', '') <> 'service_role' THEN
    RAISE EXCEPTION 'Server authorization required' USING ERRCODE = '42501';
  END IF;
  -- Administrative edits are rare. Serialize both tables, including direct
  -- writers, so role checks, seat replacement and profile edits share one state.
  LOCK TABLE public.profiles, public.executive_roles IN SHARE ROW EXCLUSIVE MODE;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id=actor_id AND role='admin') THEN
    RAISE EXCEPTION 'Administrator required' USING ERRCODE = '42501';
  END IF;
  IF jsonb_typeof(fields) IS DISTINCT FROM 'object' OR EXISTS (
    SELECT 1 FROM jsonb_object_keys(fields) k WHERE k NOT IN
      ('first_name','last_name','school','major','discord_joined','cohort','role','status','phone')
  ) THEN
    RAISE EXCEPTION 'Invalid editable fields' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO old_profile FROM public.profiles WHERE id=target_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Member not found' USING ERRCODE = 'P0002'; END IF;
  next_profile := jsonb_populate_record(old_profile, fields);
  IF next_profile.role IS NULL OR next_profile.role NOT IN ('pending','member','executive','admin') THEN
    RAISE EXCEPTION 'Invalid role' USING ERRCODE = '22023';
  END IF;
  IF target_id=actor_id AND next_profile.role='pending' THEN
    RAISE EXCEPTION 'You cannot set your own account to pending' USING ERRCODE = '22023';
  END IF;
  IF fields ? 'first_name' THEN next_profile.first_name := btrim(next_profile.first_name); END IF;
  IF fields ? 'last_name' THEN next_profile.last_name := btrim(next_profile.last_name); END IF;
  IF fields ? 'major' THEN
    IF jsonb_typeof(fields->'major') IS DISTINCT FROM 'string' OR length(btrim(next_profile.major))>120 THEN
      RAISE EXCEPTION 'Invalid major' USING ERRCODE = '22023';
    END IF;
    next_profile.major := btrim(next_profile.major);
  END IF;
  IF fields ? 'discord_joined' AND jsonb_typeof(fields->'discord_joined') IS DISTINCT FROM 'boolean' THEN
    RAISE EXCEPTION 'Invalid Discord confirmation' USING ERRCODE = '22023';
  END IF;
  IF (fields ? 'school' AND coalesce(next_profile.school,'') NOT IN ('','Seneca College','York University'))
    OR (fields ? 'status' AND coalesce(next_profile.status,'') NOT IN ('student','graduate'))
    OR (fields ? 'phone' AND coalesce(next_profile.phone,'') <> '' AND next_profile.phone !~ '^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$') THEN
    RAISE EXCEPTION 'Invalid school, status or phone' USING ERRCODE = '22023';
  END IF;
  IF next_profile.role <> 'pending' AND (
    (fields ? 'first_name' AND nullif(next_profile.first_name,'') IS NULL)
    OR (fields ? 'last_name' AND nullif(next_profile.last_name,'') IS NULL)
    OR (fields ? 'school' AND nullif(next_profile.school,'') IS NULL)
  ) THEN RAISE EXCEPTION 'Name and school are required' USING ERRCODE = '22023'; END IF;

  complete_application := nullif(btrim(next_profile.first_name),'') IS NOT NULL
    AND nullif(btrim(next_profile.last_name),'') IS NOT NULL
    AND next_profile.school IN ('Seneca College','York University')
    AND coalesce(next_profile.cohort,'') ~ '^[1-9][0-9]*$'
    AND (coalesce(next_profile.phone,'')='' OR next_profile.phone ~ '^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$')
    AND next_profile.status IN ('student','graduate')
    AND nullif(btrim(next_profile.major),'') IS NOT NULL
    AND length(btrim(next_profile.major)) <= 120;
  IF fields ? 'role' AND next_profile.role <> 'pending' THEN
    IF old_profile.role='pending' AND complete_application IS NOT TRUE THEN
      RAISE EXCEPTION 'Complete all required application fields before granting membership' USING ERRCODE = '22023';
    END IF;
    next_profile.application_status := 'approved';
  ELSIF fields ? 'role' AND old_profile.role <> 'pending' THEN
    next_profile.application_status := CASE WHEN complete_application THEN 'pending' ELSE 'draft' END;
  END IF;

  SELECT * INTO current_title FROM public.executive_roles WHERE user_id=target_id AND end_date IS NULL;
  next_title := CASE WHEN set_title THEN nullif(requested_title,'')::public.executive_title ELSE current_title.title END;
  IF next_profile.role NOT IN ('admin','executive') THEN next_title := NULL; END IF;
  IF next_title IS NOT NULL AND nullif(next_profile.school,'') IS NULL THEN
    RAISE EXCEPTION 'School is required to assign an executive title' USING ERRCODE = '22023';
  END IF;

  UPDATE public.profiles SET first_name=next_profile.first_name, last_name=next_profile.last_name,
    school=next_profile.school, major=next_profile.major, discord_joined=next_profile.discord_joined,
    cohort=next_profile.cohort, role=next_profile.role, status=next_profile.status,
    phone=next_profile.phone, application_status=next_profile.application_status
  WHERE id=target_id RETURNING * INTO next_profile;

  IF next_title IS NULL OR current_title.title IS DISTINCT FROM next_title
    OR current_title.school IS DISTINCT FROM next_profile.school THEN
    UPDATE public.executive_roles SET end_date=CURRENT_DATE
      WHERE user_id=target_id AND end_date IS NULL;
    IF next_title IS NOT NULL THEN
      UPDATE public.executive_roles SET end_date=CURRENT_DATE
        WHERE title=next_title AND school=next_profile.school AND end_date IS NULL;
      INSERT INTO public.executive_roles(user_id,title,school,start_date)
        VALUES(target_id,next_title,next_profile.school,CURRENT_DATE);
    END IF;
  END IF;
  RETURN to_jsonb(next_profile) || jsonb_build_object('executive_title',next_title);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_edit_member(uuid,uuid,jsonb,boolean,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_edit_member(uuid,uuid,jsonb,boolean,text) TO service_role;
COMMIT;
