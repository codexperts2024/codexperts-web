import { supabase } from '@/lib/supabase'
import { fetchWithTimeout } from '@/utils/fetchWithTimeout'
import { withTimeout } from '@/utils/withTimeout'

export async function signInWithGoogle(redirectTo) {
  // Flag that an OAuth redirect is about to happen so the pageshow handler
  // can force a reload if the user presses back (bfcache restoration would
  // leave Supabase's PKCE verifier in a stale state, blocking a second attempt).
  sessionStorage.setItem('oauth_pending', '1')
  const options = redirectTo ? { redirectTo } : {}
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

export async function createProfile({ id, first_name, last_name, nickname, email, avatarUrl, school, cohort, phone, status, company, occupation, linkedin, github }) {
  // JoinModal onboarding: fills empty identity fields. DB trigger
  // protect_profiles_admin_columns blocks changes once those fields are set,
  // and always blocks role / application_status for non-admins.
  const request = supabase
    .from('profiles')
    .update({
      first_name,
      last_name,
      nickname: nickname || null,
      email,
      avatar_url: avatarUrl,
      school,
      cohort,
      phone,
      status,
      company: company || null,
      occupation: occupation || null,
      linkedin: linkedin || null,
      github: github || null,
    })
    .eq('id', id)
    .select()
    .single()

  const { data, error } = await withTimeout(request)

  if (error) throw error
  return data
}

export async function updateProfile(userId, fields) {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
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
