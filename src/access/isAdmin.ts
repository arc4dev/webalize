import type { Access } from 'payload'

/**
 * Admin-only access control
 * Returns true only for users with 'admin' role
 */
export const isAdmin: Access = ({ req: { user } }) => {
  // Check if user exists and has admin role
  if (!user) return false

  // If roles field exists and includes 'admin', allow access
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.includes('admin')
  }

  // Fallback: if no roles field, deny access (restrictive by default)
  return false
}
