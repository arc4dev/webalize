import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/locales'
import { draftMode } from 'next/headers'

export async function getFAQByLocale(locale: Locale) {
  const payload = await getPayload({ config })
  const { isEnabled } = await draftMode()

  const { docs: categories } = await payload.find({
    collection: 'faq-categories',
    locale,
    fallbackLocale: 'pl',
    sort: 'order',
    limit: 100,
    depth: 0,
    overrideAccess: false,
  })

  type WhereQuery = {
    _status?: { equals: string }
  }

  const whereQuery: WhereQuery = {}

  if (!isEnabled) {
    whereQuery._status = {
      equals: 'published',
    }
  }

  const { docs: faqItems } = await payload.find({
    collection: 'faq',
    locale,
    fallbackLocale: 'pl',
    where: Object.keys(whereQuery).length > 0 ? whereQuery : undefined,
    sort: 'order',
    limit: 1000,
    depth: 1,
    draft: isEnabled,
    overrideAccess: false,
  })

  return {
    categories,
    faqItems,
  }
}
