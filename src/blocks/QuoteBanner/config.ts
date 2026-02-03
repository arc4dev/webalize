import type { Block } from 'payload'

export const QuoteBanner: Block = {
  slug: 'quoteBanner',
  interfaceName: 'QuoteBannerBlock',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'The quote text',
      },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'The author of the quote',
      },
    },
  ],
}
