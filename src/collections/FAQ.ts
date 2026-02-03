import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order', 'updatedAt'],
    group: 'Content',
    preview: (doc) => {
      const locale = doc?.locale || 'pl'
      const secret = process.env.PAYLOAD_PREVIEW_SECRET || 'my-preview-secret-change-in-production'

      // FAQ doesn't have individual pages, so preview goes to main FAQ page
      return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/preview?secret=${secret}&slug=faq&locale=${locale}&collection=faq`
    },
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The question',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
      admin: {
        description: 'The answer to the question',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'faq-categories',
      required: true,
      admin: {
        description: 'FAQ category',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order within category (lower numbers appear first)',
      },
    },
  ],
  timestamps: true,
}
