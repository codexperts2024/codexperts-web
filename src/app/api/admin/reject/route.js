import { verifyAdminCaller } from '@/lib/adminApi'

export async function POST(request) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const { userId } = await request.json()
  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 })
  }

  const { serviceClient } = auth

  const { data: target, error: fetchError } = await serviceClient
    .from('profiles')
    .select('role, application_status')
    .eq('id', userId)
    .single()

  if (fetchError || !target) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  if (target.application_status === 'rejected') {
    return Response.json({ error: 'Application is already rejected' }, { status: 400 })
  }

  if (target.role !== 'pending' || target.application_status !== 'pending') {
    return Response.json({ error: 'User is not pending approval' }, { status: 400 })
  }

  const { data, error } = await serviceClient
    .from('profiles')
    .update({ application_status: 'rejected' })
    .eq('id', userId)
    .select('id, first_name, last_name, email, avatar_url, school, cohort, phone, status, role, application_status, created_at')
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true, profile: data })
}
