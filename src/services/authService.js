import { supabase } from '@/lib/supabase'
import { fetchWithTimeout } from '@/utils/fetchWithTimeout'
import { withTimeout } from '@/utils/withTimeout'

export async function signInWithGoogle(redirectTo) {
  // Redirect only after a bounded response, so a timed-out OAuth request
  // cannot unexpectedly navigate the user later.
  const options = { skipBrowserRedirect: true, queryParams: { prompt: 'select_account' }, ...(redirectTo ? { redirectTo } : {}) }
  const { data, error } = await withTimeout(supabase.auth.signInWithOAuth({ provider: 'google', options }))
  if (error) throw error
  if (!data?.url) throw new Error('Could not start Google sign-in. Please try again.')
  sessionStorage.setItem('oauth_pending', '1')
  window.location.assign(data.url)
}

let pendingSignOut = null
export async function signOut() {
  // Share the underlying request even after a caller times out. A retry must
  // not start another sign-out that could terminate a newly selected account.
  if (!pendingSignOut) {
    pendingSignOut = (async () => {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) throw error
      if (await getSession()) throw new Error('Your session is still active. Please retry signing out.')
      sessionStorage.removeItem('join_modal_dismissed')
      sessionStorage.removeItem('oauth_pending')
      localStorage.removeItem('auth_redirect')
    })().finally(() => { pendingSignOut = null })
  }
  return withTimeout(pendingSignOut, 15000, 'Could not confirm sign-out in time. Check your connection and retry.')
}

export async function switchGoogleAccount() {
  await signOut()
  await signInWithGoogle(`${window.location.origin}/auth/callback`)
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .rpc('get_own_profile')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  if (data) {
    const decisions = []
    let decisionError = null
    for (let offset = 0; ; offset += 1000) {
      const { data: page, error: pageError } = await supabase
        .from('application_rejections')
        .select('id, reason, rejected_at')
        .eq('profile_id', userId)
        .order('rejected_at', { ascending: false })
        .order('id', { ascending: false })
        .range(offset, offset + 999)
      if (pageError) { decisionError = pageError; break }
      decisions.push(...(page ?? []))
      if ((page ?? []).length < 1000) break
    }
    // A failure to read the reason must not erase the known rejection status.
    return {
      ...data,
      rejection_history: decisions ?? [],
      rejection_reason: decisions?.[0]?.reason ?? null,
      rejected_at: decisions?.[0]?.rejected_at ?? null,
      rejection_details_error: Boolean(decisionError),
    }
  }
  return data ?? null
}

export async function createProfile(fields) {
  const { data, error } = await withTimeout(
    supabase.rpc('submit_application', { fields }).single()
  )
  if (error) throw error
  return data
}

export async function updateProfile(userId, fields) {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select('id')
    .single()

  if (error) throw error
  return fetchProfile(userId)
}

export async function adminApproval(userID, accessToken) {
  if (!accessToken) throw new Error('No active session. Please refresh the page and log in again.')

  const res = await fetchWithTimeout('/api/admin/approve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ userId: userID }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to approve user.')
  return json.profile
}
