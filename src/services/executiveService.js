import { supabase } from '@/lib/supabase'

// Returns all currently active executives (end_date IS NULL),
// joined with their profile. Used by the About page.
export async function getCurrentExecutives() {
  const { data, error } = await supabase
    .from('executive_roles')
    .select(`
      id,
      title,
      start_date,
      term,
      profiles (
        id,
        first_name,
        last_name,
        nickname,
        avatar_url,
        school,
        linkedin,
        github
      )
    `)
    .is('end_date', null)
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    startDate: row.start_date,
    term: row.term,
    userId: row.profiles?.id,
    firstName: row.profiles?.first_name,
    lastName: row.profiles?.last_name,
    nickname: row.profiles?.nickname,
    avatarUrl: row.profiles?.avatar_url,
    school: row.profiles?.school,
    linkedinUrl: row.profiles?.linkedin,
    githubUrl: row.profiles?.github,
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

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    term: row.term,
    isCurrent: row.end_date === null,
  }))
}
