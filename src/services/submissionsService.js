import { supabase } from '@/lib/supabase'

function withSignal(query, signal) {
  return signal ? query.abortSignal(signal) : query
}

export async function fetchUserSubmissions(profileId, { signal } = {}) {
  const { data, error } = await withSignal(
    supabase
      .from('submissions')
      .select('problem_id')
      .eq('profile_id', profileId),
    signal
  )
  if (error) throw error
  return new Set((data ?? []).map((s) => s.problem_id))
}

export async function fetchOwnSubmission(profileId, problemId, { signal } = {}) {
  const { data, error } = await withSignal(
    supabase
      .from('submissions')
      .select('id, code, language, created_at, updated_at')
      .eq('profile_id', profileId)
      .eq('problem_id', problemId)
      .maybeSingle(),
    signal
  )
  if (error) throw error
  return data
}

export async function fetchCommunitySubmissions(problemId, { signal } = {}) {
  const { data, error } = await withSignal(
    supabase
      .from('submissions')
      .select(`
      id,
      code,
      language,
      created_at,
      updated_at,
      profile_id,
      profiles:profile_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
      .eq('problem_id', problemId)
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false }),
    signal
  )

  if (error) throw error

  return (data ?? []).map((row) => {
    const profile = row.profiles ?? {}
    const first = profile.first_name?.trim() || ''
    const last = profile.last_name?.trim() || ''
    const name = `${first} ${last}`.trim() || 'Member'
    return {
      id: row.id,
      code: row.code,
      language: row.language,
      submittedAt: row.updated_at || row.created_at,
      profileId: row.profile_id,
      name,
      avatarUrl: profile.avatar_url || null,
    }
  })
}
