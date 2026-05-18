import { supabase } from '@/lib/supabase'

export async function signInWithGoogle(redirectTo) {
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

export async function createProfile({ id, name, email, avatarUrl, campus, cohort, phone }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id,
      name,
      email,
      avatar_url: avatarUrl,
      campus,
      cohort,
      phone,
      role: 'pending',
    })
    .select()
    .single()

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

export async function adminApproval(userID) {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized: No active session found.');
  }

  const profile = await fetchProfile(session.user.id);
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Only admins can approve users.');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'member' })
    .eq('id', userID)
    .select()
    .single();

  if (error) throw error
  return data;
}
