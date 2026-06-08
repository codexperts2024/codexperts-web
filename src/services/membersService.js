import { supabase } from '@/lib/supabase'

const MEMBER_FIELDS = 'id, first_name, last_name, nickname, avatar_url, school, company, occupation, status, role, linkedin, github, cohort, bio, profile_visibility'

function mapMember(row) {
  return {
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
    bio: row.bio,
    profileVisibility: row.profile_visibility ?? { bio: true, linkedin: true, github: true },
  }
}

export async function fetchMembers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(MEMBER_FIELDS)
    .neq('role', 'pending')
    .order('first_name', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapMember)
}

export async function fetchMemberById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select(MEMBER_FIELDS)
    .eq('id', id)
    .single()
  if (error) throw error
  return mapMember(data)
}

export async function updateMyProfile({ nickname, bio, linkedin, github, status, profile_visibility }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('profiles')
    .update({ nickname, bio, linkedin, github, status, profile_visibility })
    .eq('id', user.id)
  if (error) throw error
}
