// @vitest-environment node
import { beforeAll, afterAll, test, expect } from 'vitest'
import { PGlite } from '@electric-sql/pglite'
import { readFileSync } from 'node:fs'
let db
const admin='00000000-0000-0000-0000-000000000001'
const target='00000000-0000-0000-0000-000000000002'
const other='00000000-0000-0000-0000-000000000003'
const edit=(fields={},title=null,setTitle=false,actor=admin,id=target)=>db.query(
  'select admin_edit_member($1,$2,$3::jsonb,$4,$5) as profile', [actor,id,JSON.stringify(fields),setTitle,title])
beforeAll(async()=>{
 db=new PGlite()
 await db.exec(`
 CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
 CREATE SCHEMA auth;
 CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS $$ SELECT NULL::uuid $$;
 CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql AS $$ SELECT '{"role":"service_role"}'::jsonb $$;
 CREATE TYPE member_role AS ENUM ('pending','member','executive','admin');
 CREATE TABLE profiles(id uuid PRIMARY KEY,first_name text,last_name text,school text,major text,
 discord_joined boolean,cohort text,role member_role,status text,phone text,application_status text);
 INSERT INTO profiles VALUES
 ('${admin}','Admin','One','Seneca College','CS',false,'1','admin','student',null,'approved'),
 ('${target}','Target','Two','Seneca College','CS',false,'1','executive','student',null,'approved'),
 ('${other}','Other','Three','Seneca College','CS',false,'1','executive','student',null,'approved');
 `)
 for(const file of ['20260607000000_add_executive_roles.sql','20260607010000_executive_roles_add_school.sql','20260607020000_executive_roles_title_enum.sql','20261008220000_atomic_admin_member_edits.sql'])
   await db.exec(readFileSync(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'))
 await db.exec(`INSERT INTO executive_roles(user_id,title,school,start_date) VALUES
 ('${target}','President','Seneca College',CURRENT_DATE),('${other}','Treasurer','Seneca College',CURRENT_DATE)`)
})
afterAll(async()=>db?.close())

test('late title insertion failure rolls back profile and both holders terms',async()=>{
 await db.exec(`CREATE FUNCTION fail_title() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Injected failure'; END $$;
 CREATE TRIGGER fail_title BEFORE INSERT ON executive_roles FOR EACH ROW EXECUTE FUNCTION fail_title();`)
 await expect(edit({first_name:'Changed'},'Treasurer',true)).rejects.toThrow('Injected failure')
 expect((await db.query('select first_name from profiles where id=$1',[target])).rows[0].first_name).toBe('Target')
 expect((await db.query('select * from executive_roles where end_date is null')).rows).toHaveLength(2)
 expect((await db.query('select * from executive_roles where end_date is not null')).rows).toHaveLength(0)
 await db.exec('DROP TRIGGER fail_title ON executive_roles')
})
test('successful seat replacement commits profile and history together; retry does not duplicate history',async()=>{
 const result=await edit({first_name:'Changed'},'Treasurer',true)
 expect(result.rows[0].profile).toMatchObject({first_name:'Changed',executive_title:'Treasurer'})
 expect((await db.query('select * from executive_roles where end_date is null')).rows).toHaveLength(1)
 expect((await db.query('select * from executive_roles where end_date is not null')).rows).toHaveLength(2)
 await edit({first_name:'Changed'},'Treasurer',true)
 expect((await db.query('select * from executive_roles')).rows).toHaveLength(3)
})
test('school move preserves title and demotion closes it',async()=>{
 expect((await edit({school:'York University'})).rows[0].profile.executive_title).toBe('Treasurer')
 expect((await db.query('select school from executive_roles where end_date is null')).rows[0].school).toBe('York University')
 expect((await edit({role:'member'})).rows[0].profile.executive_title).toBeNull()
 expect((await db.query('select * from executive_roles where end_date is null')).rows).toHaveLength(0)
})
test('database constraints reject duplicate active users and occupied school seats',async()=>{
 await db.query("insert into executive_roles(user_id,title,school,start_date) values($1,'President','York University',CURRENT_DATE)",[other])
 await expect(db.query("insert into executive_roles(user_id,title,school,start_date) values($1,'Treasurer','Seneca College',CURRENT_DATE)",[other])).rejects.toThrow('executive_roles_active_user_idx')
 await expect(db.query("insert into executive_roles(user_id,title,school,start_date) values($1,'President','York University',CURRENT_DATE)",[target])).rejects.toThrow('executive_roles_active_title_school_idx')
})
test('non-admin, self-pending, spoofed fields and incomplete promotions are rejected',async()=>{
 await expect(edit({},null,false,other)).rejects.toThrow('Administrator required')
 await expect(edit({role:'pending'},null,false,admin,admin)).rejects.toThrow('own account')
 await expect(edit({email:'spoofed'})).rejects.toThrow('Invalid editable fields')
 await edit({role:'pending',major:''})
 await expect(edit({role:'member'})).rejects.toThrow('required application')
 expect((await db.query('select role from profiles where id=$1',[target])).rows[0].role).toBe('pending')
})
test('browser roles cannot invoke administrative RPC',async()=>{
 for(const role of ['anon','authenticated']){
  await db.exec('SET ROLE '+role)
  try{await expect(edit()).rejects.toThrow('permission denied')}
  finally{await db.exec('RESET ROLE')}
 }
})
