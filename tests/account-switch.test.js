import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { signInWithGoogle, switchGoogleAccount, signOut } from '@/services/authService'

const mocks = vi.hoisted(() => ({ signOut: vi.fn(), signInWithOAuth: vi.fn(), getSession: vi.fn(), navigate: vi.fn() }))
vi.mock('@/lib/supabase', () => ({ supabase: { auth: mocks } }))
beforeEach(() => {
  vi.clearAllMocks()
  mocks.signOut.mockResolvedValue({ error: null })
  mocks.signInWithOAuth.mockResolvedValue({ data: { url: 'https://accounts.google.com/test' }, error: null })
  mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })
  vi.stubGlobal('window', { location: { origin: 'http://localhost', assign: mocks.navigate } })
})
test('Google login explicitly requests account selection', async () => {
  await signInWithGoogle('http://localhost/auth/callback')
  expect(mocks.signInWithOAuth).toHaveBeenCalledWith({ provider: 'google', options: {
    skipBrowserRedirect: true, redirectTo: 'http://localhost/auth/callback', queryParams: { prompt: 'select_account' },
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

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })

test('active session after signout blocks OAuth and navigation', async () => {
  mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'old' } } }, error: null })
  await expect(switchGoogleAccount()).rejects.toThrow('still active')
  expect(mocks.navigate).not.toHaveBeenCalled()
  expect(mocks.signInWithOAuth).not.toHaveBeenCalled()
})

test('failed local signout can be retried successfully', async () => {
  mocks.signOut.mockResolvedValueOnce({ error: new Error('Offline') })
  await expect(signOut()).rejects.toThrow('Offline')
  await signOut()
  expect(mocks.signOut).toHaveBeenCalledTimes(2)
})

test('timeout does not start OAuth or duplicate an unresolved signout', async () => {
  vi.useFakeTimers()
  let finish
  mocks.signOut.mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
  const first = expect(switchGoogleAccount()).rejects.toThrow('confirm sign-out')
  await vi.advanceTimersByTimeAsync(15001)
  await first
  const retry = signOut()
  expect(mocks.signOut).toHaveBeenCalledTimes(1)
  finish({ error: null })
  await retry
  expect(mocks.signInWithOAuth).not.toHaveBeenCalled()
  expect(mocks.navigate).not.toHaveBeenCalled()
})

test('late OAuth response after timeout cannot redirect', async () => {
  vi.useFakeTimers()
  let finish
  mocks.signInWithOAuth.mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
  const result = expect(signInWithGoogle()).rejects.toThrow('timed out')
  await vi.advanceTimersByTimeAsync(15001)
  await result
  finish({ data: { url: 'https://accounts.google.com/late' }, error: null })
  await Promise.resolve()
  expect(mocks.navigate).not.toHaveBeenCalled()
})
