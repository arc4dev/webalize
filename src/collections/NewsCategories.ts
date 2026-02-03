import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import type { CollectionConfig } from 'payload'

export const NewsCategories: CollectionConfig = {
  slug: 'news-categories',
  access: {
    read: anyone, // Public read since no drafts
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    group: 'Taxonomy',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique identifier (e.g., "technology", "business") - not translated',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Category title - translated per language',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers first)',
      },
    },
  ],
}
