import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.includes('admin')
  }
  return false
}
