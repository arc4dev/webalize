import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/locales'

export async function getIntegrationsCategories(locale: Locale) {
  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: 'integration-categories',
    locale,
    fallbackLocale: 'pl',
    sort: 'order',
    limit: 100,
    depth: 0,
    overrideAccess: false,
  })

  return categories
}

type GetIntegrationsOptions = {
  locale: Locale
  categorySlug?: string
  searchQuery?: string
}

export async function getIntegrations({
  locale,
  categorySlug,
  searchQuery,
}: GetIntegrationsOptions) {
  const payload = await getPayload({ config })

  type WhereQuery = {
    category?: { equals: string | number }
    or?: Array<{ title?: { contains: string }; subtitle?: { contains: string } }>
  }

  const whereQuery: WhereQuery = {}

  if (categorySlug && categorySlug !== 'all') {
    const categories = await getIntegrationsCategories(locale)
    const category = categories.find((cat) => cat.slug === categorySlug)
    if (category) {
      whereQuery.category = {
        equals: category.id,
      }
    }
  }

  if (searchQuery && searchQuery.trim() !== '') {
    whereQuery.or = [
      {
        title: {
          contains: searchQuery.trim(),
        },
      },
      {
        subtitle: {
          contains: searchQuery.trim(),
        },
      },
    ]
  }

  const { docs: integrations } = await payload.find({
    collection: 'integrations',
    locale,
    fallbackLocale: 'pl',
    where: Object.keys(whereQuery).length > 0 ? whereQuery : undefined,
    sort: 'order',
    limit: 1000,
    depth: 1,
    overrideAccess: false,
  })

  return integrations
}
