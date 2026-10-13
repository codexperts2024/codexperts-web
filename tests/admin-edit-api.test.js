// @vitest-environment node
import { beforeEach, expect, test, vi } from 'vitest'
import { PATCH } from '@/app/api/admin/members/[id]/route'
const mocks=vi.hoisted(()=>({verify:vi.fn(),rpc:vi.fn()}))
vi.mock('@/lib/adminApi',()=>({verifyAdminCaller:mocks.verify}))
beforeEach(()=>{
 vi.clearAllMocks()
 mocks.verify.mockResolvedValue({user:{id:'actor'},serviceClient:{rpc:mocks.rpc}})
 mocks.rpc.mockResolvedValue({data:{id:'target',executive_title:'President'},error:null})
})
const request=body=>new Request('http://localhost/api/admin/members/target',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
test('API uses one RPC with verified actor, dropping caller-supplied identity',async()=>{
 const r=await PATCH(request({first_name:' New ',actor_id:'spoofed',executive_title:'President'}),{params:Promise.resolve({id:'target'})})
 expect(r.status).toBe(200)
 expect(mocks.rpc).toHaveBeenCalledExactlyOnceWith('admin_edit_member',{actor_id:'actor',target_id:'target',fields:{first_name:'New'},set_title:true,requested_title:'President'})
 expect(mocks.verify).toHaveBeenCalledWith(expect.anything(),{adminOnly:true})
})
test('omitted title preserves current title while explicit null clears it',async()=>{
 await PATCH(request({school:'York University'}),{params:{id:'target'}})
 expect(mocks.rpc.mock.calls[0][1].set_title).toBe(false)
 await PATCH(request({executive_title:null}),{params:{id:'target'}})
 expect(mocks.rpc.mock.calls[1][1]).toMatchObject({set_title:true,requested_title:null})
})
test('transaction errors are returned without reporting success',async()=>{
 mocks.rpc.mockResolvedValue({data:null,error:{code:'P0002',message:'Member not found'}})
 expect((await PATCH(request({first_name:'Name'}),{params:{id:'target'}})).status).toBe(404)
})
