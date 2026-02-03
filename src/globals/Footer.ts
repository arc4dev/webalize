import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'socialLinks',
      type: 'array',
      admin: {
        description: 'Social media links (LinkedIn, Twitter, GitHub, etc.)',
      },
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
          admin: {
            description: 'Platform name (e.g., LinkedIn, Twitter, GitHub)',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Full URL to social profile',
          },
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: '© {year} Webalize. All rights reserved.',
      admin: {
        description: 'Copyright text. Use {year} placeholder for dynamic year.',
      },
    },
  ],
}
