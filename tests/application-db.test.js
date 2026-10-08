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
    CREATE ROLE anon;
    CREATE ROLE service_role;
    CREATE SCHEMA auth;
    GRANT USAGE ON SCHEMA auth TO authenticated;
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
  await db.exec(readFileSync(new URL('../supabase/migrations/20261008150000_optional_phone_and_rejections.sql', import.meta.url), 'utf8'))
  await db.exec(readFileSync(new URL('../supabase/migrations/20261008180000_allow_reapplication.sql', import.meta.url), 'utf8'))
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

test('phone may be absent, null, or blank, but a supplied phone must be valid', async () => {
  const { phone, ...withoutPhone } = fields
  for (const payload of [withoutPhone, { ...fields, phone: '' }, { ...fields, phone: null }]) {
    expect((await submit(payload)).rows[0]).toMatchObject({ phone: null, application_status: 'pending' })
  }
  await expect(submit({ ...fields, phone: '123' })).rejects.toThrow('required')
})

test('missing own profile is repaired and rejected applicants can resubmit while approved members cannot', async () => {
  await db.query('delete from profiles where id = $1', [uid])
  expect((await submit(fields)).rows[0].id).toBe(uid)
  await db.query("select set_config('request.user_id', $1, false)", [approved])
  await expect(submit(fields)).rejects.toThrow('cannot be submitted')
  await db.query("select set_config('request.jwt_role', 'service_role', false)")
  await db.query("update profiles set application_status = 'rejected' where id = $1", [uid])
  await db.query("select set_config('request.jwt_role', 'authenticated', false)")
  await db.query("select set_config('request.user_id', $1, false)", [uid])
  await expect(submit({ ...fields, major: '' })).rejects.toThrow('required')
  expect((await db.query('select application_status from profiles where id = $1', [uid])).rows[0].application_status).toBe('rejected')
  expect((await submit({ ...fields, first_name: 'Reapplicant' })).rows[0]).toMatchObject({ application_status: 'pending', first_name: 'Reapplicant', role: 'pending' })
  await db.query("select set_config('request.user_id', '', false)")
  await expect(submit(fields)).rejects.toThrow('Unauthorized')
})

test('rejection saves status, reason, date and reviewer atomically and protects reasons with RLS', async () => {
  await db.query("select set_config('request.jwt_role', 'service_role', false)")
  await db.query("update profiles set role = 'admin' where id = $1", [approved])
  await db.query("update profiles set application_status = 'pending' where id = $1", [uid])
  const reject = reason => db.query('select reject_application($1, $2, $3) as decision', [uid, approved, reason])
  await expect(reject('   ')).rejects.toThrow('reason')
  expect((await db.query('select application_status from profiles where id = $1', [uid])).rows[0].application_status).toBe('pending')
  expect((await db.query('select * from application_rejections')).rows).toHaveLength(0)
  const { rows } = await reject('  Please contact the club about eligibility.  ')
  expect(rows[0].decision).toMatchObject({ application_status: 'rejected', rejection_reason: 'Please contact the club about eligibility.' })
  expect(rows[0].decision.rejected_at).toBeTruthy()
  await expect(reject('Duplicate decision')).rejects.toThrow('no longer pending')
  expect((await db.query('select * from application_rejections')).rows).toHaveLength(1)

  await db.exec(`
    INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000003', 'other@example.com', '{}');
    INSERT INTO profiles(id, role, application_status) VALUES ('00000000-0000-0000-0000-000000000003', 'member', 'approved');
  `)
  await db.exec('SET ROLE authenticated')
  await db.query("select set_config('request.jwt_role', 'authenticated', false)")
  await db.query("select set_config('request.user_id', $1, false)", [uid])
  expect((await db.query('select reason from application_rejections')).rows).toHaveLength(1)
  await expect(reject('Forged decision')).rejects.toThrow('permission denied')
  await expect(db.query("update application_rejections set reason = 'Altered'")).rejects.toThrow('permission denied')
  await db.query("select set_config('request.user_id', '00000000-0000-0000-0000-000000000003', false)")
  expect((await db.query('select reason from application_rejections')).rows).toHaveLength(0)
  await db.query("select set_config('request.user_id', $1, false)", [approved])
  expect((await db.query('select reason from application_rejections')).rows).toHaveLength(1)
  await db.exec('RESET ROLE')
  await db.query("select set_config('request.user_id', $1, false)", [uid])
  expect((await submit(fields)).rows[0].application_status).toBe('pending')
  expect((await db.query('select reason from application_rejections')).rows).toEqual([
    { reason: 'Please contact the club about eligibility.' },
  ])
})
