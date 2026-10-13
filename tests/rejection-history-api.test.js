// @vitest-environment node
import { beforeEach, expect, test, vi } from 'vitest'
import { GET } from '@/app/api/admin/members/route'
const mocks=vi.hoisted(()=>({verify:vi.fn(),from:vi.fn()}))
vi.mock('@/lib/adminApi',()=>({verifyAdminCaller:mocks.verify}))
beforeEach(()=>{
 vi.clearAllMocks()
 const data={
  profiles:[{id:'applicant',application_status:'approved',role:'member'},{id:'reviewer',first_name:'Review',last_name:'Admin',role:'admin'}],
  executive_roles:[],
  application_rejections:[{id:2,profile_id:'applicant',reason:'Recent',rejected_by:'reviewer',rejected_at:'2026-10-08'},{id:1,profile_id:'applicant',reason:'Earlier',rejected_by:null,rejected_at:'2026-10-07'}],
 }
 mocks.from.mockImplementation(table=>{
  const result={data:data[table],error:null}
  const query={select:()=>query,order:()=>query,is:()=>query,range:()=>Promise.resolve(result),then:(...args)=>Promise.resolve(result).then(...args)}
  return query
 })
 mocks.verify.mockResolvedValue({serviceClient:{from:mocks.from},callerProfile:{role:'admin'}})
})
test('review API includes every rejection for an approved applicant and identifies reviewer',async()=>{
 const response=await GET(new Request('http://localhost/api/admin/members'))
 const member=(await response.json()).members.find(m=>m.id==='applicant')
 expect(member.rejection_history).toHaveLength(2)
 expect(member.rejection_history[0].reviewer_name).toBe('Review Admin')
 expect(member.rejection_history[1].reviewer_name).toBe('Reviewer unavailable')
 expect(member.application_status).toBe('approved')
})
test('unauthorized callers cannot fetch history',async()=>{
 mocks.verify.mockResolvedValue({error:Response.json({error:'Forbidden'},{status:403})})
 expect((await GET(new Request('http://localhost/api/admin/members'))).status).toBe(403)
 expect(mocks.from).not.toHaveBeenCalled()
})
