import { supabase } from '@/lib/supabase'

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

function withSignal(query, signal) {
  return signal ? query.abortSignal(signal) : query
}

export async function fetchMembers({ signal } = {}) {
  const { data, error } = await withSignal(
    supabase
      .rpc('get_visible_profiles')
      .order('first_name', { ascending: true }),
    signal
  )

  if (error) throw error
  return (data ?? []).map(mapMember)
}

export async function fetchMemberById(id, { signal } = {}) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  const ownProfile = session?.user?.id === id
  const { data, error } = await withSignal(
    supabase
      .rpc(ownProfile ? 'get_own_profile' : 'get_visible_profiles')
      .eq('id', id)
      .single(),
    signal
  )
  if (error) throw error
  return mapMember(data)
}

export async function updateMyProfile({ nickname, bio, linkedin, github, status, profile_visibility, company, occupation, school }) {
  // Only user-editable fields. role / name / email / cohort / avatar are
  // protected by protect_profiles_admin_columns (DB trigger).
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('profiles')
    .update({ nickname, bio, linkedin, github, status, profile_visibility, company, occupation, school })
    .eq('id', user.id)
  if (error) throw error
}
