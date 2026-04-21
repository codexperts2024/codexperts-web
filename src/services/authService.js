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
