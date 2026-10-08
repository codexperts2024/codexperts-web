import { supabase } from '@/lib/supabase'

// Returns all currently active executives (end_date IS NULL),
// joined with their profile. Used by the About page.
export async function getCurrentExecutives({ signal } = {}) {
  let query = supabase
    .from('executive_roles')
    .select('id, user_id, title, school, start_date, term')
    .is('end_date', null)
    .order('created_at', { ascending: true })
  if (signal) query = query.abortSignal(signal)
  const { data, error } = await query

  if (error) throw error

  let profilesQuery = supabase.rpc('get_visible_profiles')
  if (signal) profilesQuery = profilesQuery.abortSignal(signal)
  const { data: profiles, error: profilesError } = await profilesQuery
  if (profilesError) throw profilesError
  const byId = new Map((profiles ?? []).map(profile => [profile.id, profile]))

  return (data ?? []).filter(row => byId.has(row.user_id)).map((row) => ({
    id: row.id,
    title: row.title,
    // Campus seat comes from executive_roles.school (not profile.school)
    school: row.school,
    startDate: row.start_date,
    term: row.term,
    userId: byId.get(row.user_id)?.id,
    firstName: byId.get(row.user_id)?.first_name,
    lastName: byId.get(row.user_id)?.last_name,
    nickname: byId.get(row.user_id)?.nickname,
    avatarUrl: byId.get(row.user_id)?.avatar_url,
    linkedinUrl: byId.get(row.user_id)?.linkedin,
    githubUrl: byId.get(row.user_id)?.github,
  }))
}

// Returns the full executive role history for a given user.
// Used by member profile pages to display past/present titles.
export async function getExecutiveHistory(userId) {
  const { data, error } = await supabase
    .from('executive_roles')
    .select('id, title, start_date, end_date, term')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })

  if (error) throw error

  return (data ?? []).filter(row => byId.has(row.user_id)).map((row) => ({
    id: row.id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    term: row.term,
    isCurrent: row.end_date === null,
  }))
}
