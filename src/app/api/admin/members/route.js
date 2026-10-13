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

  const profileNames = new Map((data ?? []).map(row => [row.id,
    [row.first_name, row.last_name].filter(Boolean).join(' ') || row.email || 'Reviewer']))
  const rejectionByUserId = {}
  // Page the complete history independently of current application status.
  for (let offset = 0; ; offset += 1000) {
    const { data: rejections, error: rejectionError } = await serviceClient
      .from('application_rejections')
      .select('id, profile_id, reason, rejected_at, rejected_by')
      .order('rejected_at', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + 999)
    if (rejectionError) return Response.json({ error: rejectionError.message }, { status: 500 })
    for (const rejection of rejections ?? []) {
      const history = rejectionByUserId[rejection.profile_id] ??= []
      history.push({
        ...rejection,
        reviewer_name: profileNames.get(rejection.rejected_by) ?? 'Reviewer unavailable',
      })
    }
    if ((rejections ?? []).length < 1000) break
  }

  const members = (data ?? []).filter(row =>
    auth.callerProfile.role === 'admin' || row.application_status !== 'draft'
  ).map((row) => ({
    ...row,
    rejection_history: rejectionByUserId[row.id] ?? [],
    executive_title: titleByUserId[row.id] ?? null,
    rejection_reason: rejectionByUserId[row.id]?.[0]?.reason ?? null,
    rejected_at: rejectionByUserId[row.id]?.[0]?.rejected_at ?? null,
  }))

  const sorted = [...members].sort((a, b) => {
    const aPending = a.role === 'pending' && a.application_status === 'pending'
    const bPending = b.role === 'pending' && b.application_status === 'pending'
    if (aPending !== bPending) return aPending ? -1 : 1
    return (a.first_name ?? '').localeCompare(b.first_name ?? '')
  })

  return Response.json({ members: sorted })
}
