import { verifyAdminCaller } from '@/lib/adminApi'
import { SCHOOLS, ROLES } from '@/utils/constants'
import { isValidPhone } from '@/utils/phone'

const EDITABLE_ROLES = [ROLES.MEMBER, ROLES.EXECUTIVE, ROLES.ADMIN]
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

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  if (updates.first_name !== undefined && !String(updates.first_name).trim()) {
    return Response.json({ error: 'First name is required' }, { status: 400 })
  }

  if (updates.last_name !== undefined && !String(updates.last_name).trim()) {
    return Response.json({ error: 'Last name is required' }, { status: 400 })
  }

  if (updates.school !== undefined && !SCHOOLS.includes(updates.school)) {
    return Response.json({ error: 'Invalid school' }, { status: 400 })
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

  if (updates.first_name) updates.first_name = String(updates.first_name).trim()
  if (updates.last_name) updates.last_name = String(updates.last_name).trim()

  if (updates.role && updates.role !== ROLES.PENDING) {
    updates.application_status = 'approved'
  }

  const { serviceClient } = auth

  const { data, error } = await serviceClient
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select('id, first_name, last_name, email, avatar_url, school, cohort, phone, status, role, application_status, created_at')
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ profile: data })
}
