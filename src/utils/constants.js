export const CAMPUSES = ['Seneca College', 'York University']

export const ROLES = {
  PENDING: 'pending',
  MEMBER: 'member',
  EXECUTIVE: 'executive',
  ADMIN: 'admin',
}

export const APPROVED_ROLES = [ROLES.MEMBER, ROLES.EXECUTIVE, ROLES.ADMIN]

export const isApprovedRole = (role) => APPROVED_ROLES.includes(role)

const MEMBER_ROUTE_BLOCKED = [ROLES.PENDING]

export const canAccessMemberRoutes = (role) => !!role && !MEMBER_ROUTE_BLOCKED.includes(role)

export const canAccessAdminRoutes = (role) => role === ROLES.ADMIN
