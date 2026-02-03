import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { GlobalConfig } from 'payload'

export const Global: GlobalConfig = {
  slug: 'global',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    // Contact Info Group
    {
      type: 'group',
      name: 'contactInfo',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            description: 'Contact email',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          admin: {
            description: 'Contact phone',
          },
        },
      ],
    },
  ],
}
