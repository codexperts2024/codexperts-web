// @vitest-environment node
import { beforeEach, expect, test, vi } from 'vitest'
import { POST } from '@/app/api/upload/route'

const mocks = vi.hoisted(() => ({ user: vi.fn(), single: vi.fn(), update: vi.fn(), eq: vi.fn(), stream: vi.fn() }))
vi.mock('cloudinary', () => ({ v2: { config: vi.fn(), uploader: { upload_stream: mocks.stream } } }))
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({
  auth: { getUser: mocks.user },
  from: () => {
    const query = { select: () => query, update: fields => { mocks.update(fields); return query }, eq: (...args) => { mocks.eq(...args); return query }, single: mocks.single }
    return query
  },
}) }))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.user.mockResolvedValue({ data: { user: { id: 'owner' } }, error: null })
  mocks.single.mockReset().mockResolvedValueOnce({ data: { role: 'member' } }).mockResolvedValue({ data: { avatar_url: 'https://res.cloudinary.com/new.jpg' } })
  mocks.stream.mockImplementation((options, callback) => ({ end: () => callback(null, { secure_url: 'https://res.cloudinary.com/new.jpg', public_id: 'new' }) }))
})

function request(type = 'image/jpeg') {
  const body = new FormData()
  body.append('file', new File(['image'], 'photo.jpg', { type }))
  body.append('userId', 'someone-else')
  const req = new Request('http://localhost/api/upload?folder=profiles', { method: 'POST', headers: { Authorization: 'Bearer token' }, body })
  req.nextUrl = new URL(req.url)
  return req
}

test('profile upload saves only the authenticated owner even with a spoofed target', async () => {
  const response = await POST(request())
  expect(response.status).toBe(200)
  expect(mocks.update).toHaveBeenCalledWith({ avatar_url: 'https://res.cloudinary.com/new.jpg' })
  expect(mocks.eq.mock.calls).toEqual([['id', 'owner'], ['id', 'owner']])
})

test('failed profile write does not report successful photo saving', async () => {
  mocks.single.mockReset().mockResolvedValueOnce({ data: { role: 'member' } }).mockResolvedValueOnce({ data: null, error: { message: 'failed' } })
  expect((await POST(request())).status).toBe(500)
})

test('unsupported images never reach the uploader', async () => {
  expect((await POST(request('image/svg+xml'))).status).toBe(400)
  expect(mocks.stream).not.toHaveBeenCalled()
})

test('unapproved users cannot upload a profile photo', async () => {
  mocks.single.mockReset().mockResolvedValue({ data: { role: 'pending' } })
  expect((await POST(request())).status).toBe(403)
  expect(mocks.update).not.toHaveBeenCalled()
})
