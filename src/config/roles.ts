/**
 * Role-Based Access Control (RBAC) Configuration
 * Defines permissions for each user role in the SegreGate system
 */

export const ROLES = {
  ADMIN: "admin",
  VOLUNTEER: "volunteer",
  USER: "user",
} as const;

/**
 * Permission mapping: role -> array of allowed permissions
 * Permissions represent actions users can perform
 */
export const ROLE_PERMISSIONS = {
  admin: [
    "create_user",
    "read_user",
    "update_user",
    "delete_user",
    "create_report",
    "read_report",
    "update_report",
    "delete_report",
    "verify_report",
    "view_all_reports",
    "access_analytics",
    "manage_roles",
  ],
  volunteer: [
    "read_user",
    "create_report",
    "read_report",
    "update_report",
    "verify_report",
    "view_local_reports",
  ],
  user: ["read_user", "create_report", "read_report", "update_report", "view_own_reports"],
} as const;

/**
 * Protected routes that require authentication
 * Routes matched with startsWith() logic
 */
export const PROTECTED_ROUTES = ["/api/reports", "/api/users", "/api/upload", "/api/admin"];

/**
 * Admin-only routes
 * Routes matched with startsWith() logic
 */
export const ADMIN_ONLY_ROUTES = ["/api/admin"];

/**
 * Check if user has a specific permission based on role
 * @param role - User role (admin, volunteer, user)
 * @param permission - Permission to check
 * @returns true if user has permission, false otherwise
 */
export function hasPermission(
  role: string,
  permission: string
): boolean {
  const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
  if (!permissions) return false;
  return permissions.includes(permission as any);
}

/**
 * Check if user role is admin
 */
export function isAdmin(role: string): boolean {
  return role === ROLES.ADMIN;
}

/**
 * Check if user role is volunteer
 */
export function isVolunteer(role: string): boolean {
  return role === ROLES.VOLUNTEER;
}

/**
 * Check if user role is regular user
 */
export function isRegularUser(role: string): boolean {
  return role === ROLES.USER;
}
