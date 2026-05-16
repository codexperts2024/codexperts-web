

ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;


CREATE TYPE member_role AS ENUM ('pending', 'member', 'executive', 'admin');

ALTER TABLE profiles 
  ALTER COLUMN role TYPE member_role 
  USING (
    CASE 
      WHEN role::text = 'public' THEN 'pending'::member_role
      ELSE role::text::member_role 
    END
  );

ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'pending'::member_role;
