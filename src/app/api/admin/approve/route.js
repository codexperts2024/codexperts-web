import { verifyAdminCaller } from '@/lib/adminApi'
import { hasRequiredApplicationFields } from '@/utils/application'

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
    .select('*')
    .eq('id', userId)
    .single()

  if (fetchError || !target) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  if (target.application_status === 'rejected') {
    return Response.json({ error: 'Cannot approve a rejected application' }, { status: 400 })
  }

  if (target.role !== 'pending' || target.application_status !== 'pending') {
    return Response.json({ error: 'User is not pending approval' }, { status: 400 })
  }

  if (!hasRequiredApplicationFields(target)) {
    return Response.json({ error: 'Complete the required application fields, including major, before approval.' }, { status: 400 })
  }

  const { data, error } = await serviceClient
    .from('profiles')
    .update({ role: 'member', application_status: 'approved' })
    .eq('id', userId)
    .eq('role', 'pending')
    .eq('application_status', 'pending')
    .select('id, first_name, last_name, email, avatar_url, school, major, discord_joined, cohort, phone, status, role, application_status, created_at')
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true, profile: data })
}
