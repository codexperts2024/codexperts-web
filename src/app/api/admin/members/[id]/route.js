import { verifyAdminCaller } from '@/lib/adminApi'
import { syncExecutiveTitle } from '@/lib/syncExecutiveTitle'
import { SCHOOLS, ROLES, EXECUTIVE_TITLES } from '@/utils/constants'
import { isValidPhone } from '@/utils/phone'

const EDITABLE_ROLES = [ROLES.PENDING, ROLES.MEMBER, ROLES.EXECUTIVE, ROLES.ADMIN]
const EDITABLE_STATUSES = ['student', 'graduate']

const ALLOWED_FIELDS = new Set([
  'first_name',
  'last_name',
  'school',
  'cohort',
  'role',
  'status',
  'phone',
])

function normalizeStatus(status) {
  if (status === 'graduated') return 'graduate'
  return status
}

export async function PATCH(request, { params }) {
  const auth = await verifyAdminCaller(request, { adminOnly: true })
  if (auth.error) return auth.error

  const { id } = await params
  if (!id) {
    return Response.json({ error: 'Member id is required' }, { status: 400 })
  }

  const body = await request.json()
  const updates = {}

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_FIELDS.has(key)) continue
    updates[key] = value
  }

  const hasTitleField = Object.prototype.hasOwnProperty.call(body, 'executive_title')
  const requestedTitle = hasTitleField
    ? (body.executive_title === '' || body.executive_title == null ? null : body.executive_title)
    : undefined

  if (Object.keys(updates).length === 0 && !hasTitleField) {
    return Response.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const revertingToPending = updates.role === ROLES.PENDING

  if (!revertingToPending) {
    if (updates.first_name !== undefined && !String(updates.first_name).trim()) {
      return Response.json({ error: 'First name is required' }, { status: 400 })
    }

    if (updates.last_name !== undefined && !String(updates.last_name).trim()) {
      return Response.json({ error: 'Last name is required' }, { status: 400 })
    }
  }

  if (updates.school !== undefined && updates.school !== '' && !SCHOOLS.includes(updates.school)) {
    return Response.json({ error: 'Invalid school' }, { status: 400 })
  }

  if (!revertingToPending && updates.school !== undefined && !updates.school) {
    return Response.json({ error: 'School is required' }, { status: 400 })
  }

  if (updates.role !== undefined && !EDITABLE_ROLES.includes(updates.role)) {
    return Response.json({ error: 'Invalid role' }, { status: 400 })
  }

  if (updates.status !== undefined) {
    updates.status = normalizeStatus(updates.status)
    if (!EDITABLE_STATUSES.includes(updates.status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }
  }

  if (updates.phone !== undefined && updates.phone && !isValidPhone(updates.phone)) {
    return Response.json({ error: 'Phone must match (XXX) XXX-XXXX' }, { status: 400 })
  }

  if (requestedTitle !== undefined && requestedTitle !== null && !EXECUTIVE_TITLES.includes(requestedTitle)) {
    return Response.json({ error: 'Invalid executive title' }, { status: 400 })
  }

  if (updates.first_name) updates.first_name = String(updates.first_name).trim()
  if (updates.last_name) updates.last_name = String(updates.last_name).trim()

  if (updates.role === ROLES.PENDING) {
    updates.application_status = 'pending'
  } else if (updates.role) {
    updates.application_status = 'approved'
  }

  const { serviceClient, user } = auth

  if (updates.role === ROLES.PENDING && id === user.id) {
    return Response.json({ error: 'You cannot set your own account to pending' }, { status: 400 })
  }

  const { data: existing, error: existingError } = await serviceClient
    .from('profiles')
    .select('id, role, school')
    .eq('id', id)
    .single()

  if (existingError || !existing) {
    return Response.json({ error: 'Member not found' }, { status: 404 })
  }

  let profile = existing

  if (Object.keys(updates).length > 0) {
    const { data, error } = await serviceClient
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('id, first_name, last_name, email, avatar_url, school, cohort, phone, status, role, application_status, created_at')
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    profile = data
  } else {
    const { data, error } = await serviceClient
      .from('profiles')
      .select('id, first_name, last_name, email, avatar_url, school, cohort, phone, status, role, application_status, created_at')
      .eq('id', id)
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }
    profile = data
  }

  let executiveTitle = null

  if (hasTitleField || updates.role !== undefined || updates.school !== undefined) {
    const nextRole = profile.role
    const nextSchool = profile.school
    let nextTitle = requestedTitle

    if (!hasTitleField) {
      const { data: activeRole, error: activeRoleError } = await serviceClient
        .from('executive_roles')
        .select('title')
        .eq('user_id', id)
        .is('end_date', null)
        .maybeSingle()

      if (activeRoleError) {
        return Response.json({ error: activeRoleError.message }, { status: 500 })
      }
      nextTitle = activeRole?.title ?? null
    }

    try {
      executiveTitle = await syncExecutiveTitle(serviceClient, {
        userId: id,
        role: nextRole,
        school: nextSchool,
        title: nextTitle,
      })
    } catch (err) {
      return Response.json({ error: err.message }, { status: 400 })
    }
  } else {
    const { data: activeRole } = await serviceClient
      .from('executive_roles')
      .select('title')
      .eq('user_id', id)
      .is('end_date', null)
      .maybeSingle()
    executiveTitle = activeRole?.title ?? null
  }

  return Response.json({
    profile: {
      ...profile,
      executive_title: executiveTitle,
    },
  })
}
