import { verifyAdminCaller } from '@/lib/adminApi'

export async function GET(request) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const { serviceClient } = auth

  const { data, error } = await serviceClient
    .from('profiles')
    .select(
      'id, first_name, last_name, nickname, email, avatar_url, school, major, discord_joined, cohort, phone, status, role, application_status, occupation, company, linkedin, github, bio, created_at, updated_at'
    )
    .order('first_name', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const { data: activeRoles, error: rolesError } = await serviceClient
    .from('executive_roles')
    .select('user_id, title')
    .is('end_date', null)

  if (rolesError) {
    return Response.json({ error: rolesError.message }, { status: 500 })
  }

  const titleByUserId = Object.fromEntries(
    (activeRoles ?? []).map((row) => [row.user_id, row.title])
  )

  const rejectedIds = (data ?? []).filter(row => row.application_status === 'rejected').map(row => row.id)
  const rejectionByUserId = {}
  if (rejectedIds.length) {
    const { data: rejections, error: rejectionError } = await serviceClient
      .from('application_rejections')
      .select('profile_id, reason, rejected_at')
      .in('profile_id', rejectedIds)
      .order('rejected_at', { ascending: false })
      .order('id', { ascending: false })
    if (rejectionError) return Response.json({ error: rejectionError.message }, { status: 500 })
    for (const rejection of rejections ?? []) {
      rejectionByUserId[rejection.profile_id] ??= rejection
    }
  }

  const members = (data ?? []).filter(row =>
    auth.callerProfile.role === 'admin' || row.application_status !== 'draft'
  ).map((row) => ({
    ...row,
    executive_title: titleByUserId[row.id] ?? null,
    rejection_reason: rejectionByUserId[row.id]?.reason ?? null,
    rejected_at: rejectionByUserId[row.id]?.rejected_at ?? null,
  }))

  const sorted = [...members].sort((a, b) => {
    const aPending = a.role === 'pending' && a.application_status === 'pending'
    const bPending = b.role === 'pending' && b.application_status === 'pending'
    if (aPending !== bPending) return aPending ? -1 : 1
    return (a.first_name ?? '').localeCompare(b.first_name ?? '')
  })

  return Response.json({ members: sorted })
}
