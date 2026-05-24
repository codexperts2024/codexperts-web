import { supabase } from '@/lib/supabase'

export async function fetchUserSubmissions(profileId) {
  const { data, error } = await supabase
    .from('submissions')
    .select('problem_id')
    .eq('profile_id', profileId)
  if (error) throw error
  return new Set((data ?? []).map(s => s.problem_id))
}
