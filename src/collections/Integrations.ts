import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Integrations: CollectionConfig = {
  slug: 'integrations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['image', 'title', 'category', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Small integration logo or icon',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Short description of the integration',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'integration-categories',
      required: true,
      hasMany: false,
    },
  ],
  timestamps: true,
}
