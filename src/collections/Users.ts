import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Collections',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true, // Include in JWT for fast access checks
      access: {
        // Only admins can modify roles
        update: ({ req: { user } }) => {
          if (!user) return false
          if (user.roles && Array.isArray(user.roles)) {
            return user.roles.includes('admin')
          }
          return false
        },
      },
    },
    // Email added by default
    // Add more fields as needed
  ],
}
