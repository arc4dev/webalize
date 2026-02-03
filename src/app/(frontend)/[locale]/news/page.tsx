import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/locales'
import { getNews, getNewsCategories } from '@/data-access/news'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string; page?: string }>
}

const POSTS_PER_PAGE = 10

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { category: categorySlug, page: pageParam } = await searchParams

  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'news' })

  // Parse page number
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1
  const validPage = currentPage > 0 ? currentPage : 1

  // Fetch all categories (sorted by order) using cached function
  const categories = await getNewsCategories(locale)

  // Fetch news posts with pagination using cached function
  const {
    docs: newsPosts,
    totalPages,
    page,
    hasNextPage,
    hasPrevPage,
  } = await getNews({
    locale,
    categorySlug,
    page: validPage,
    limit: POSTS_PER_PAGE,
  })

  // Build category URL helper
  const getCategoryUrl = (slug: string | null) => {
    if (!slug || slug === 'all') {
      return '/news'
    }
    return `/news?category=${slug}`
  }

  // Build pagination URL helper
  const getPaginationUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    if (categorySlug && categorySlug !== 'all') {
      params.set('category', categorySlug)
    }
    if (pageNum > 1) {
      params.set('page', pageNum.toString())
    }
    const query = params.toString()
    return query ? `/news?${query}` : '/news'
  }

  return (
    <div>
      <h1>{t('title')}</h1>

      {/* Categories filter */}
      <nav>
        <h2>{t('categories')}</h2>
        <ul>
          <li>
            <Link href={getCategoryUrl(null)}>
              {!categorySlug || categorySlug === 'all' ? (
                <strong>{t('allCategories')}</strong>
              ) : (
                t('allCategories')
              )}
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={getCategoryUrl(category.slug)}>
                {categorySlug === category.slug ? (
                  <strong>{category.title}</strong>
                ) : (
                  category.title
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* News posts list */}
      {newsPosts.length === 0 ? (
        <p>{t('noResults')}</p>
      ) : (
        <>
          <div>
            {newsPosts.map((post) => {
              const category = typeof post.category === 'object' ? post.category : null
              return (
                <article key={post.id}>
                  <h2>
                    <Link href={`/news/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {category && <p>Category: {category.title}</p>}
                  {post.excerpt && <p>{post.excerpt}</p>}
                  {post.publishedAt && (
                    <p>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString(locale)}
                      </time>
                    </p>
                  )}
                  <Link href={`/news/${post.slug}`}>{t('readMore')}</Link>
                </article>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && page && (
            <nav>
              <p>{t('pagination.page', { page: page.toString(), total: totalPages.toString() })}</p>
              <ul>
                {hasPrevPage && (
                  <li>
                    <Link href={getPaginationUrl(page - 1)}>{t('pagination.previous')}</Link>
                  </li>
                )}
                {hasNextPage && (
                  <li>
                    <Link href={getPaginationUrl(page + 1)}>{t('pagination.next')}</Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  )
}
