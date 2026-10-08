import React, { useContext } from 'react'
import { beforeEach, afterEach, test, expect, vi } from 'vitest'
import { render, screen, waitFor, act, cleanup } from '@testing-library/react'
import { AuthProvider, AuthContext } from '@/contexts/AuthContext'

const mocks = vi.hoisted(() => ({ callback: null, fetch: vi.fn(), session: vi.fn() }))
vi.mock('@/lib/supabase', () => ({ supabase: { auth: {
  onAuthStateChange: cb => { mocks.callback = cb; return { data: { subscription: { unsubscribe() {} } } } },
} } }))
vi.mock('@/services/authService', () => ({ getSession: mocks.session, fetchProfile: mocks.fetch, signOut: vi.fn() }))
let auth
function Probe() {
  auth = useContext(AuthContext)
  return <div>{auth.user?.id}:{auth.profile?.first_name}:{auth.profileError}</div>
}
const session = { user: { id: 'one' }, access_token: 'token' }
beforeEach(() => {
  mocks.session.mockResolvedValue(session)
  mocks.fetch.mockReset().mockResolvedValue({ id: 'one', first_name: 'Saved' })
})
afterEach(cleanup)

test('auth callback returns synchronously; a failed profile refresh retains saved identity', async () => {
  render(<AuthProvider><Probe /></AuthProvider>)
  await screen.findByText('one:Saved:')
  mocks.fetch.mockRejectedValueOnce(new Error('Request timed out'))
  let result
  act(() => { result = mocks.callback('TOKEN_REFRESHED', session) })
  expect(result).toBeUndefined()
  await screen.findByText('one:Saved:Request timed out')
  expect(auth.user.id).toBe('one')
})

test('a slow old profile fetch cannot overwrite the just-saved application', async () => {
  render(<AuthProvider><Probe /></AuthProvider>)
  await screen.findByText('one:Saved:')
  let resolveFetch
  mocks.fetch.mockImplementationOnce(() => new Promise(resolve => { resolveFetch = resolve }))
  act(() => { mocks.callback('SIGNED_IN', session) })
  await waitFor(() => expect(resolveFetch).toBeTypeOf('function'))
  act(() => auth.acceptProfile({ id: 'one', first_name: 'Submitted' }))
  await act(async () => resolveFetch({ id: 'one', first_name: 'Stale' }))
  expect(screen.getByText('one:Submitted:')).toBeTruthy()
})
