// @vitest-environment node
import { beforeAll, afterAll, test, expect } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { readFileSync } from 'node:fs'

let db
beforeAll(async () => {
  db = new PGlite()
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$
      SELECT nullif(current_setting('request.user_id', true), '')::uuid
    $$;
    GRANT USAGE ON SCHEMA auth TO authenticated;
    CREATE TABLE profiles (
      id uuid PRIMARY KEY, email text, phone text, first_name text, last_name text,
      nickname text, avatar_url text, school text, company text, occupation text,
      status text, role text, linkedin text, github text, cohort text, bio text,
      profile_visibility jsonb, major text, discord_joined boolean,
      application_status text, created_at timestamptz, updated_at timestamptz
    );
    INSERT INTO profiles(id,email,phone,first_name,role) VALUES
      ('00000000-0000-0000-0000-000000000001','owner@example.test','private-owner','Owner','member'),
      ('00000000-0000-0000-0000-000000000002','admin@example.test','private-admin','Admin','admin');
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY directory ON profiles FOR SELECT TO authenticated USING (true);
    CREATE POLICY executives ON profiles FOR SELECT TO anon USING (role='admin');
    GRANT SELECT ON profiles TO anon, authenticated;
    GRANT SELECT(email,phone) ON profiles TO anon, authenticated;
  `)
  await db.exec(readFileSync(new URL('../supabase/migrations/20261008200000_protect_profile_contacts.sql', import.meta.url), 'utf8'))
})
afterAll(async () => db?.close())

test.each(['anon', 'authenticated'])('%s cannot read or filter private contacts', async role => {
  await db.exec(`SET ROLE ${role}`)
  try {
    expect((await db.query('select id, first_name, role from profiles')).rows.length).toBeGreaterThan(0)
    for (const sql of ['select email from profiles', 'select phone from profiles', 'select * from profiles', "select id from profiles where phone='private-admin'", 'select id from profiles order by email']) {
      await expect(db.query(sql)).rejects.toThrow('permission denied')
    }
    if (role === 'anon') await expect(db.query('select * from get_own_profile()')).rejects.toThrow('permission denied')
  } finally { await db.exec('RESET ROLE') }
})

test('owner RPC returns only the caller, including their own contacts', async () => {
  await db.exec("SET ROLE authenticated; SELECT set_config('request.user_id','00000000-0000-0000-0000-000000000001',false)")
  try {
    const { rows } = await db.query('select email,phone from get_own_profile()')
    expect(rows).toEqual([{ email: 'owner@example.test', phone: 'private-owner' }])
    expect((await db.query("select * from get_own_profile() where id='00000000-0000-0000-0000-000000000002'")).rows).toEqual([])
    await db.query("select set_config('request.user_id','',false)")
    expect((await db.query('select * from get_own_profile()')).rows).toEqual([])
  } finally { await db.exec('RESET ROLE') }
})

test('server reviewer reads remain available', async () => {
  await db.exec('SET ROLE service_role')
  try { expect((await db.query('select email,phone from profiles')).rows).toHaveLength(2) }
  finally { await db.exec('RESET ROLE') }
})
