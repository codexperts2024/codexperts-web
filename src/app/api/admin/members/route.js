import { verifyAdminCaller } from '@/lib/adminApi'

export async function GET(request) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const { serviceClient } = auth

  const { data, error } = await serviceClient
    .from('profiles')
    .select('id, first_name, last_name, email, avatar_url, school, cohort, phone, status, role, application_status, created_at')
    .neq('application_status', 'rejected')
    .order('first_name', { ascending: true })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const sorted = [...(data ?? [])].sort((a, b) => {
    const aPending = a.role === 'pending' && a.application_status === 'pending'
    const bPending = b.role === 'pending' && b.application_status === 'pending'
    if (aPending !== bPending) return aPending ? -1 : 1
    return (a.first_name ?? '').localeCompare(b.first_name ?? '')
  })

  return Response.json({ members: sorted })
}
