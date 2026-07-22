ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;


-- Helper used by profiles_select_directory_member_plus to avoid the RLS
-- infinite-recursion error that occurs when a policy on profiles subqueries
-- profiles. SECURITY DEFINER runs with row security disabled.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.member_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

CREATE POLICY profiles_select_self
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY profiles_select_directory_member_plus
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.get_my_role() IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'pending'::public.member_role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);

CREATE POLICY problems_select_member_plus
ON public.problems
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY problems_insert_exec_admin
ON public.problems
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY problems_update_exec_admin
ON public.problems
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY problems_delete_exec_admin
ON public.problems
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY submissions_select_member_plus
ON public.submissions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY submissions_insert_own_member_plus
ON public.submissions
FOR INSERT
TO authenticated
WITH CHECK (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY submissions_update_own_member_plus
ON public.submissions
FOR UPDATE
TO authenticated
USING (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
)
WITH CHECK (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY submissions_delete_own_member_plus
ON public.submissions
FOR DELETE
TO authenticated
USING (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY sessions_select_exec_admin
ON public.sessions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY sessions_insert_exec_admin
ON public.sessions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY sessions_update_exec_admin
ON public.sessions
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY sessions_delete_exec_admin
ON public.sessions
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY attendances_select_exec_admin
ON public.attendances
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY attendances_insert_own_member_plus
ON public.attendances
FOR INSERT
TO authenticated
WITH CHECK (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY attendances_update_own_member_plus
ON public.attendances
FOR UPDATE
TO authenticated
USING (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
)
WITH CHECK (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY attendances_delete_own_member_plus
ON public.attendances
FOR DELETE
TO authenticated
USING (
  profile_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('member'::public.member_role, 'executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY announcements_select_public
ON public.announcements
FOR SELECT
TO anon, authenticated
USING (TRUE);

CREATE POLICY announcements_insert_exec_admin
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY announcements_update_exec_admin
ON public.announcements
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY announcements_delete_exec_admin
ON public.announcements
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY events_select_public
ON public.events
FOR SELECT
TO anon, authenticated
USING (TRUE);

CREATE POLICY events_insert_exec_admin
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY events_update_exec_admin
ON public.events
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

CREATE POLICY events_delete_exec_admin
ON public.events
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles AS p
    WHERE p.id = auth.uid()
      AND p.role IN ('executive'::public.member_role, 'admin'::public.member_role)
  )
);

