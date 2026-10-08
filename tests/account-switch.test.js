import { beforeEach, expect, test, vi } from 'vitest'
import { signInWithGoogle, switchGoogleAccount } from '@/services/authService'

const mocks = vi.hoisted(() => ({ signOut: vi.fn(), signInWithOAuth: vi.fn() }))
vi.mock('@/lib/supabase', () => ({ supabase: { auth: mocks } }))
beforeEach(() => {
  vi.clearAllMocks()
  mocks.signOut.mockResolvedValue({ error: null })
  mocks.signInWithOAuth.mockResolvedValue({ error: null })
})
test('Google login explicitly requests account selection', async () => {
  await signInWithGoogle('http://localhost/auth/callback')
  expect(mocks.signInWithOAuth).toHaveBeenCalledWith({ provider: 'google', options: {
    redirectTo: 'http://localhost/auth/callback', queryParams: { prompt: 'select_account' },
  } })
})
test('account switching clears the local session before starting OAuth', async () => {
  await switchGoogleAccount()
  expect(mocks.signOut).toHaveBeenCalledWith({ scope: 'local' })
  expect(mocks.signOut.mock.invocationCallOrder[0]).toBeLessThan(mocks.signInWithOAuth.mock.invocationCallOrder[0])
})
test('failed signout does not silently continue under another identity', async () => {
  mocks.signOut.mockResolvedValue({ error: new Error('Offline') })
  await expect(switchGoogleAccount()).rejects.toThrow('Offline')
  expect(mocks.signInWithOAuth).not.toHaveBeenCalled()
})
