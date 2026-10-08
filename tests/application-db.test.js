// @vitest-environment node
import { beforeAll, afterAll, test, expect } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { readFileSync } from 'node:fs'

let db
const uid = '00000000-0000-0000-0000-000000000001'
const approved = '00000000-0000-0000-0000-000000000002'
const fields = {
  first_name: 'Test', last_name: 'Applicant', school: 'Seneca College',
  cohort: '1', phone: '(416) 555-0100', status: 'graduate', major: 'Computer Programming',
  discord_joined: false,
}
const submit = data => db.query('select (public.submit_application($1::jsonb)).*', [JSON.stringify(data)])

beforeAll(async () => {
  db = new PGlite()
  await db.exec(`
    CREATE ROLE authenticated;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$
      SELECT nullif(current_setting('request.user_id', true), '')::uuid
    $$;
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$
      SELECT jsonb_build_object('role', coalesce(current_setting('request.jwt_role', true), 'authenticated'))
    $$;
    CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb);
    CREATE TYPE public.member_role AS ENUM ('pending', 'member', 'executive', 'admin');
    CREATE TABLE public.profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id), email text, avatar_url text,
      first_name text, last_name text, nickname text, school text, cohort text, phone text,
      status text, company text, occupation text, linkedin text, github text,
      role member_role DEFAULT 'pending', application_status text NOT NULL DEFAULT 'pending'
        CONSTRAINT profiles_application_status_check CHECK (application_status IN ('pending', 'approved', 'rejected'))
    );
    CREATE FUNCTION public.get_my_role() RETURNS member_role LANGUAGE sql SECURITY DEFINER AS $$
      SELECT role FROM profiles WHERE id = auth.uid()
    $$;
    INSERT INTO auth.users VALUES ('${uid}', 'test@example.com', '{}'), ('${approved}', 'member@example.com', '{}');
    INSERT INTO profiles(id,email) VALUES ('${uid}', 'test@example.com');
    INSERT INTO profiles(id,email,role,application_status,status)
      VALUES ('${approved}', 'member@example.com','member','approved','graduated');
  `)
  await db.exec(readFileSync(new URL('../supabase/migrations/20260722160000_protect_profiles_admin_columns.sql', import.meta.url), 'utf8'))
  await db.exec(readFileSync(new URL('../supabase/migrations/20261008120000_application_submission.sql', import.meta.url), 'utf8'))
  await db.query("select set_config('request.user_id', $1, false)", [uid])
}, 30000)
afterAll(async () => db?.close())

test('migration restores incomplete applications without demoting approved members', async () => {
  const { rows } = await db.query('select * from profiles order by id')
  expect(rows[0].application_status).toBe('draft')
  expect(rows[1].application_status).toBe('approved')
  expect(rows[1].role).toBe('member')
  expect(rows[1].status).toBe('graduate')
})

test('invalid submission is atomic and stays draft', async () => {
  await expect(submit({ ...fields, major: '' })).rejects.toThrow('required')
  const { rows } = await db.query('select * from profiles where id = $1', [uid])
  expect(rows[0].first_name).toBeNull()
  expect(rows[0].application_status).toBe('draft')
  await expect(db.query("update profiles set application_status = 'pending' where id = $1", [uid])).rejects.toThrow('required')
})

test('valid submission and retries keep one profile and permit pending corrections', async () => {
  const result = await submit(fields)
  expect(result.rows[0]).toMatchObject({ ...fields, application_status: 'pending' })
  await submit(fields)
  const edited = await submit({ ...fields, first_name: 'Corrected', discord_joined: true })
  expect(edited.rows[0]).toMatchObject({ first_name: 'Corrected', discord_joined: true })
  expect((await db.query('select * from profiles where id = $1', [uid])).rows).toHaveLength(1)
})

test('submission ignores spoofed identity and privilege fields', async () => {
  const result = await submit({ ...fields, id: approved, email: 'spoof@example.com', role: 'admin', application_status: 'approved' })
  expect(result.rows[0]).toMatchObject({ id: uid, email: 'test@example.com', role: 'pending', application_status: 'pending' })
  await expect(db.query("update profiles set role = 'admin' where id = $1", [uid])).rejects.toThrow('role')
})

test('missing own profile is repaired, approved/rejected profiles cannot resubmit', async () => {
  await db.query('delete from profiles where id = $1', [uid])
  expect((await submit(fields)).rows[0].id).toBe(uid)
  await db.query("select set_config('request.user_id', $1, false)", [approved])
  await expect(submit(fields)).rejects.toThrow('cannot be submitted')
  await db.query("select set_config('request.jwt_role', 'service_role', false)")
  await db.query("update profiles set application_status = 'rejected' where id = $1", [uid])
  await db.query("select set_config('request.jwt_role', 'authenticated', false)")
  await db.query("select set_config('request.user_id', $1, false)", [uid])
  await expect(submit(fields)).rejects.toThrow('cannot be submitted')
  await db.query("select set_config('request.user_id', '', false)")
  await expect(submit(fields)).rejects.toThrow('Unauthorized')
})
