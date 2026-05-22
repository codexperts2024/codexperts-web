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
    .select('*')
    .neq('role', 'pending')
    .order('name', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    school: row.school,
    workplace: row.occupation,
    status: row.status,
    role: row.role,
    linkedinUrl: row.linkedin,
    githubUrl: row.github,
    cohort: row.cohort,
  }))
}