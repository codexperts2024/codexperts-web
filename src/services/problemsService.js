import { supabase } from '@/lib/supabase'

export async function fetchProblems(schoolFilter) {
  let query = supabase
    .from('problems')
    .select('*')
    .order('week', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (schoolFilter && schoolFilter !== 'All Schools') {
    query = query.eq('school', schoolFilter)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function deleteProblem(id) {
  const { error } = await supabase.from('problems').delete().eq('id', id)
  if (error) throw error
}
