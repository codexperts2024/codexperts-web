import { fetchWithTimeout } from '@/utils/fetchWithTimeout'

async function adminFetch(accessToken, path, options = {}) {
  if (!accessToken) {
    throw new Error('No active session. Please refresh the page and log in again.')
  }

  const res = await fetchWithTimeout(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

  let json
  try {
    json = await res.json()
  } catch {
    throw new Error('Server returned an invalid response. Try again or refresh the page.')
  }

  if (!res.ok) throw new Error(json.error ?? 'Request failed.')
  return json
}

function mapMember(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    avatarUrl: row.avatar_url,
    school: row.school,
    cohort: row.cohort,
    phone: row.phone,
    status: row.status,
    role: row.role,
    applicationStatus: row.application_status,
    createdAt: row.created_at,
  }
}

export function isPendingApplicant(member) {
  return member.role === 'pending' && member.applicationStatus === 'pending'
}

export async function fetchAdminMembers(accessToken) {
  const { members } = await adminFetch(accessToken, '/api/admin/members')
  return members.map(mapMember)
}

export async function approveMember(accessToken, userId) {
  const { profile } = await adminFetch(accessToken, '/api/admin/approve', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  })
  return mapMember(profile)
}

export async function rejectMember(accessToken, userId) {
  await adminFetch(accessToken, '/api/admin/reject', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  })
}

export async function updateAdminMember(accessToken, userId, fields) {
  const { profile } = await adminFetch(accessToken, `/api/admin/members/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  })
  return mapMember(profile)
}

export function memberToForm(member) {
  const status = member.status === 'graduated' ? 'graduate' : (member.status ?? 'student')
  return {
    first_name: member.firstName ?? '',
    last_name: member.lastName ?? '',
    school: member.school ?? '',
    cohort: member.cohort ?? '',
    role: member.role ?? 'member',
    status,
    phone: member.phone ?? '',
  }
}
