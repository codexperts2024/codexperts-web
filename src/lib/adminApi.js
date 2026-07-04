import { createClient } from '@supabase/supabase-js'

export function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function verifyAdminCaller(request, { adminOnly = false } = {}) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const token = authHeader.slice(7)
  const serviceClient = getServiceClient()

  const { data: { user }, error: authError } = await serviceClient.auth.getUser(token)
  if (authError || !user) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: callerProfile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !callerProfile) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const allowed = adminOnly
    ? callerProfile.role === 'admin'
    : ['admin', 'executive'].includes(callerProfile.role)

  if (!allowed) {
    return { error: Response.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { serviceClient, user, callerProfile }
}

export async function verifyMemberPlusCaller(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const token = authHeader.slice(7)
  const serviceClient = getServiceClient()

  const { data: { user }, error: authError } = await serviceClient.auth.getUser(token)
  if (authError || !user) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const { data: callerProfile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !callerProfile) {
    return { error: Response.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (!['member', 'executive', 'admin'].includes(callerProfile.role)) {
    return { error: Response.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { serviceClient, user, callerProfile }
}
