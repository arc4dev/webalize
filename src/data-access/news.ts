import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import type { Locale } from '@/i18n/locales'

const CACHE_TAG = 'news'
const POSTS_PER_PAGE = 10

type GetNewsParams = {
  locale: Locale
  categorySlug?: string
  page?: number
  limit?: number
  skipDraftMode?: boolean
}

type GetNewsBySlugParams = {
  locale: Locale
  slug: string
  depth?: number
  skipDraftMode?: boolean
}

const getCachedNewsInternal = unstable_cache(
  async ({ locale, categorySlug, page = 1, limit = POSTS_PER_PAGE }: GetNewsParams) => {
    const payload = await getPayload({ config })

    let categoryId: string | number | undefined
    if (categorySlug && categorySlug !== 'all') {
      const { docs: categories } = await payload.find({
        collection: 'news-categories',
        where: { slug: { equals: categorySlug } },
        locale,
        fallbackLocale: 'pl',
        limit: 1,
        depth: 0,
        overrideAccess: false,
      })
      categoryId = categories[0]?.id
    }

    // Build where query
    type WhereQuery = {
      _status: { equals: string }
      category?: { equals: string | number }
    }

    const whereQuery: WhereQuery = {
      _status: {
        equals: 'published',
      },
    }

    if (categoryId) {
      whereQuery.category = {
        equals: categoryId,
      }
    }

    // Fetch news posts
    const result = await payload.find({
      collection: 'news',
      locale,
      fallbackLocale: 'pl',
      where: whereQuery,
      sort: '-publishedAt',
      limit,
      page,
      depth: 1,
      overrideAccess: false,
    })

    return result
  },
  ['news-list'],
  {
    tags: [CACHE_TAG],
    revalidate: 3600, // 1 hour
  },
)

/**
 * Cached function to fetch news categories
 */
const getCachedNewsCategoriesInternal = unstable_cache(
  async (locale: Locale) => {
    const payload = await getPayload({ config })

    const { docs: categories } = await payload.find({
      collection: 'news-categories',
      locale,
      fallbackLocale: 'pl',
      sort: 'order',
      limit: 100,
      depth: 0,
      overrideAccess: false,
    })

    return categories
  },
  ['news-categories'],
  {
    tags: [CACHE_TAG],
    revalidate: 3600,
  },
)

/**
 * Cached function to fetch a single news post by slug
 */
const getCachedNewsBySlugInternal = unstable_cache(
  async ({ locale, slug, depth = 2 }: GetNewsBySlugParams) => {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'news',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      locale,
      fallbackLocale: 'pl',
      limit: 1,
      depth,
      overrideAccess: false,
    })

    return docs[0] || null
  },
  ['news-by-slug'],
  {
    tags: [CACHE_TAG],
    revalidate: 3600,
  },
)

/**
 * Cached function to fetch all published news posts (for static params generation)
 */
const getCachedAllNewsInternal = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'news',
      limit: 1000,
      depth: 0,
      where: {
        _status: {
          equals: 'published',
        },
      },
      overrideAccess: false,
    })

    return docs
  },
  ['news-all'],
  {
    tags: [CACHE_TAG],
    revalidate: 3600,
  },
)

/**
 * Get news posts with pagination and filtering.
 * Uses cache in production, bypasses cache in draft mode.
 */
export async function getNews(params: GetNewsParams) {
  const isEnabled = params.skipDraftMode ? false : (await draftMode()).isEnabled

  if (isEnabled) {
    // Draft mode: bypass cache and fetch drafts
    const payload = await getPayload({ config })

    let categoryId: string | number | undefined
    if (params.categorySlug && params.categorySlug !== 'all') {
      const { docs: categories } = await payload.find({
        collection: 'news-categories',
        where: { slug: { equals: params.categorySlug } },
        locale: params.locale,
        fallbackLocale: 'pl',
        limit: 1,
        depth: 0,
        overrideAccess: false,
      })
      categoryId = categories[0]?.id
    }

    type WhereQuery = {
      category?: { equals: string | number }
    }

    const whereQuery: WhereQuery = {}

    if (categoryId) {
      whereQuery.category = {
        equals: categoryId,
      }
    }

    return await payload.find({
      collection: 'news',
      locale: params.locale,
      fallbackLocale: 'pl',
      where: whereQuery,
      sort: '-publishedAt',
      limit: params.limit || POSTS_PER_PAGE,
      page: params.page || 1,
      depth: 1,
      draft: true,
      overrideAccess: false,
    })
  }

  // Production: use cached version
  return getCachedNewsInternal(params)
}

/**
 * Get news categories.
 * Uses cache in production, bypasses cache in draft mode.
 */
export async function getNewsCategories(locale: Locale, skipDraftMode = false) {
  const isEnabled = skipDraftMode ? false : (await draftMode()).isEnabled

  if (isEnabled) {
    // Draft mode: bypass cache
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'news-categories',
      locale,
      fallbackLocale: 'pl',
      sort: 'order',
      limit: 100,
      depth: 0,
      overrideAccess: false,
    })
    return docs
  }

  // Production: use cached version
  return getCachedNewsCategoriesInternal(locale)
}

/**
 * Get a single news post by slug.
 * Uses cache in production, bypasses cache in draft mode.
 */
export async function getNewsBySlug(params: GetNewsBySlugParams) {
  const isEnabled = params.skipDraftMode ? false : (await draftMode()).isEnabled

  if (isEnabled) {
    // Draft mode: bypass cache and fetch drafts
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'news',
      where: {
        slug: { equals: params.slug },
      },
      locale: params.locale,
      fallbackLocale: 'pl',
      limit: 1,
      depth: params.depth || 2,
      draft: true,
      overrideAccess: false,
    })
    return docs[0] || null
  }

  // Production: use cached version
  return getCachedNewsBySlugInternal(params)
}

/**
 * Get all published news posts (for static params generation).
 * Always uses cache during build time.
 */
export async function getAllNews() {
  // During build time (generateStaticParams), we can't access draftMode
  // Always use cached version
  return getCachedAllNewsInternal()
}

/**
 * Get all news posts with draft mode support.
 * Use this when you need draft mode in runtime contexts.
 */
export async function getAllNewsDynamic() {
  const { isEnabled } = await draftMode()

  if (isEnabled) {
    // Draft mode: bypass cache
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'news',
      limit: 1000,
      depth: 0,
      draft: true,
      overrideAccess: false,
    })
    return docs
  }

  // Production: use cached version
  return getCachedAllNewsInternal()
}

/**
 * Get related news posts (same category, excluding current post).
 * Uses cache in production, bypasses cache in draft mode.
 */
export async function getRelatedNews(params: {
  locale: Locale
  currentPostId: string | number
  categoryId?: string | number
  limit?: number
  skipDraftMode?: boolean
}) {
  type WhereQuery = {
    id: { not_equals: string | number }
    _status?: { equals: string }
    category?: { equals: string | number }
  }

  const isEnabled = params.skipDraftMode ? false : (await draftMode()).isEnabled
  const payload = await getPayload({ config })

  const whereQuery: WhereQuery = {
    id: { not_equals: params.currentPostId },
  }

  if (!isEnabled) {
    whereQuery._status = { equals: 'published' }
  }

  if (params.categoryId) {
    whereQuery.category = { equals: params.categoryId }
  }

  const { docs } = await payload.find({
    collection: 'news',
    where: whereQuery,
    locale: params.locale,
    fallbackLocale: 'pl',
    sort: '-publishedAt',
    limit: params.limit || 3,
    depth: 1,
    draft: isEnabled,
    overrideAccess: false,
  })

  return docs
}
