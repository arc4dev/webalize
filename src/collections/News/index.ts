import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { type CollectionConfig } from 'payload'
import { QuoteBannerBlock } from '@/blocks/QuoteBanner'
import { revalidateNews, revalidateDelete } from './hooks/revalidateNews'

export const News: CollectionConfig = {
  slug: 'news',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    group: 'Content',
    preview: (doc) => {
      const locale = doc?.locale || 'pl'
      const secret = process.env.PAYLOAD_PREVIEW_SECRET || 'my-preview-secret-change-in-production'

      if (doc?.slug) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/preview?secret=${secret}&slug=${doc.slug}&locale=${locale}&collection=news`
      }

      return null
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'News post title',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description:
                  'Main image for the news article (1920x1080px recommended). All necessary image sizes (thumbnails, cards, social media) will be automatically generated from this image.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [QuoteBannerBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    LinkFeature({
                      fields: ({ defaultFields }) => [
                        ...defaultFields,
                        {
                          name: 'rel',
                          label: 'Rel Attribute',
                          type: 'select',
                          hasMany: true,
                          options: ['noopener', 'noreferrer', 'nofollow'],
                          admin: {
                            description:
                              'The rel attribute defines the relationship between a linked resource and the current document.',
                          },
                        },
                      ],
                    }),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              required: true,
              maxLength: 200,
              admin: {
                description: 'Short summary (max 200 chars, for cards)',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'news-categories',
              required: true,
              hasMany: false,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'heroImage',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },

    ...slugField('title'),
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-set publishedAt on first publish
        if (operation === 'create' && data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [revalidateNews],
    afterDelete: [revalidateDelete],
  },
}
