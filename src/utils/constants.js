// Constants used across the application
export const ROLES = {
    PENDING: 'pending',
    MEMBER: 'member',
    EXECUTIVE: 'executive',
    ADMIN: 'admin'
};

const MEMBER_ROUTE_BLOCKED = [ROLES.PENDING];

export const canAccessMemberRoutes = (role) =>
    !!role && !MEMBER_ROUTE_BLOCKED.includes(role);

export const canAccessAdminRoutes = (role) =>
    role === ROLES.ADMIN;
