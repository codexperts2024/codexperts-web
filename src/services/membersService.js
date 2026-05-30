import { supabase } from '@/lib/supabase'

/**
 * Fetches all approved members from the profiles table.
 * Maps DB columns (snake_case) to MemberCard's expected prop shape (camelCase).
 *
 * TODO: When backend adds an `approval_status` column, swap the `.neq('role', 'pending')`
 *       filter for `.eq('approval_status', 'approved')`.
 * TODO: Sort by activity score (submissions + attendance, last 90 days) once those tables exist.
 *       For now, sorted alphabetically by name.
 */
export async function fetchMembers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, nickname, avatar_url, school, company, occupation, status, role, linkedin, github, cohort')
    .neq('role', 'pending')
    .order('first_name', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    school: row.school,
    company: row.company,
    occupation: row.occupation,
    status: row.status,
    role: row.role,
    linkedinUrl: row.linkedin,
    githubUrl: row.github,
    cohort: row.cohort,
  }))
}

export async function fetchMemberById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, nickname, avatar_url, school, company, occupation, status, role, linkedin, github, cohort')
    .eq('id', id)
    .single()
  if (error) throw error

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    nickname: data.nickname,
    avatarUrl: data.avatar_url,
    school: data.school,
    company: data.company,
    occupation: data.occupation,
    status: data.status,
    role: data.role,
    linkedinUrl: data.linkedin,
    githubUrl: data.github,
    cohort: data.cohort
  }
}

// export async function fetchMemberBadges(id) {
//   const { data, error } = await supabase
//     .from('user_badges')
//     .select('*, badges(*)')
//     .eq('user_id', id)
//   if (error) throw error

//   return data ?? []
// }
