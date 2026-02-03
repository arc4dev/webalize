import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { NewsCategories } from './collections/NewsCategories'
import { FAQ } from './collections/FAQ'
import { FAQCategories } from './collections/FAQCategories'
import { Integrations } from './collections/Integrations'
import { IntegrationCategories } from './collections/IntegrationCategories'
import { FormSubmissions } from './collections/FormSubmissions'
import { Navigation } from './globals/Navigation'
import { Footer } from './globals/Footer'
import { Global } from './globals/Global'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    News,
    NewsCategories,
    FAQ,
    FAQCategories,
    Integrations,
    IntegrationCategories,
    FormSubmissions,
  ],
  globals: [Navigation, Footer, Global],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  localization: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
    fallback: true,
  },
  sharp,
  plugins: [
    seoPlugin({
      collections: ['news'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Webalize — ${doc?.title?.value || doc?.title || ''}`,
      generateDescription: ({ doc }) => doc?.excerpt?.value || doc?.excerpt || '',
    }),
  ],
})
