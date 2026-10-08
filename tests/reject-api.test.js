// @vitest-environment node
import { beforeEach, test, expect, vi } from 'vitest'
import { POST } from '@/app/api/admin/reject/route'
const mocks = vi.hoisted(() => ({ verify: vi.fn(), rpc: vi.fn() }))
vi.mock('@/lib/adminApi', () => ({ verifyAdminCaller: mocks.verify }))
beforeEach(() => {
  vi.clearAllMocks()
  mocks.verify.mockResolvedValue({ user: { id: 'reviewer' }, serviceClient: { rpc: mocks.rpc } })
})
const request = reason => new Request('http://localhost/api/admin/reject', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'applicant', reason, reviewer_id: 'spoofed' }),
})
test.each(['', '   ', null, 'x'.repeat(1001)])('invalid rejection reason is rejected before database writes', async reason => {
  expect((await POST(request(reason))).status).toBe(400)
  expect(mocks.rpc).not.toHaveBeenCalled()
})
test('rejection uses authenticated reviewer and returns the saved decision', async () => {
  mocks.rpc.mockResolvedValue({ data: { id: 'applicant', application_status: 'rejected', rejection_reason: 'Reason', rejected_at: '2026-10-08T15:00:00Z' }, error: null })
  const response = await POST(request('  Reason  '))
  expect(response.status).toBe(200)
  expect(mocks.rpc).toHaveBeenCalledWith('reject_application', {
    applicant_id: 'applicant', reviewer_id: 'reviewer', rejection_reason: 'Reason',
  })
  expect((await response.json()).profile.rejection_reason).toBe('Reason')
})
test('stale review does not report a successful rejection', async () => {
  mocks.rpc.mockResolvedValue({ data: null, error: { code: '22023', message: 'Application is no longer pending review' } })
  expect((await POST(request('Reason'))).status).toBe(409)
})
