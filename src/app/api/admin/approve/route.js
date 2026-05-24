import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS. Server-side only.
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const serviceClient = getServiceClient()

  // Verify the caller's JWT and get their profile
  const { data: { user }, error: authError } = await serviceClient.auth.getUser(token)
  if (authError || !user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: callerProfile, error: profileError } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !callerProfile) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (callerProfile.role !== 'admin' && callerProfile.role !== 'executive') {
    return Response.json({ error: 'Forbidden: admin or executive role required' }, { status: 403 })
  }

  const { userId } = await request.json()
  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 })
  }

  // Update the target user's role using service role (bypasses RLS)
  const { data, error } = await serviceClient
    .from('profiles')
    .update({ role: 'member' })
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true, profile: data })
}
