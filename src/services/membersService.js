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
    .select('id, first_name, last_name, nickname, avatar_url, school, occupation, status, role, linkedin, github, cohort')
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
    occupation: row.occupation,
    status: row.status,
    role: row.role,
    linkedinUrl: row.linkedin,
    githubUrl: row.github,
    cohort: row.cohort,
  }))
}
