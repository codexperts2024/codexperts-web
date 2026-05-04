export const ROLES = {
  ADMIN: 'admin',
  EXECUTIVE: 'executive',
  MEMBER: 'member',
  PENDING: 'pending',
}

export const APPROVED_ROLES = [ROLES.MEMBER, ROLES.EXECUTIVE, ROLES.ADMIN]

export function isApprovedRole(role) {
  return APPROVED_ROLES.includes(role)
}
