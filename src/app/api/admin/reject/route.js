import { verifyAdminCaller } from '@/lib/adminApi'

export async function POST(request) {
  const auth = await verifyAdminCaller(request)
  if (auth.error) return auth.error

  const { userId, reason } = await request.json()
  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 })
  }
  if (typeof reason !== 'string' || !reason.trim() || reason.trim().length > 1000) {
    return Response.json({ error: 'A rejection reason of 1 to 1000 characters is required.' }, { status: 400 })
  }

  const { serviceClient } = auth

  const { data, error } = await serviceClient.rpc('reject_application', {
    applicant_id: userId,
    reviewer_id: auth.user.id,
    rejection_reason: reason.trim(),
  })

  if (error) {
    const status = error.code === 'P0002' ? 404 : error.code === '42501' ? 403 : error.code === '22023' ? 409 : 500
    return Response.json({ error: error.message }, { status })
  }

  return Response.json({ ok: true, profile: data })
}
