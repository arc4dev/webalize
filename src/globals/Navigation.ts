import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          hasMany: true,
          defaultValue: ['header'],
          options: [
            { label: 'Header', value: 'header' },
            { label: 'Footer', value: 'footer' },
            { label: 'Legal', value: 'legal' },
          ],
          admin: {
            description: 'Where this link appears (can select multiple)',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Link text',
          },
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: {
            description: 'URL path (e.g., "/news", "/about")',
          },
        },
        {
          name: 'children',
          type: 'array',
          admin: {
            description: 'Dropdown menu items (optional, for 2-level navigation)',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
