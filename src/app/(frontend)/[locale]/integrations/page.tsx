import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { IntegrationSearch } from '@/components/IntegrationSearch'
import type { Locale } from '@/i18n/locales'
import { getIntegrations, getIntegrationsCategories } from '@/data-access/integrations'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ category?: string; search?: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'integrations' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function IntegrationsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { category: categorySlug, search: searchQuery } = await searchParams

  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'integrations' })

  // Fetch data using data-access layer
  const categories = await getIntegrationsCategories(locale)
  const integrations = await getIntegrations({
    locale,
    categorySlug,
    searchQuery,
  })

  // Build category URL helper
  const getCategoryUrl = (slug: string | null) => {
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set('search', searchQuery)
    }
    if (slug && slug !== 'all') {
      params.set('category', slug)
    }
    const query = params.toString()
    return query ? `/integrations?${query}` : '/integrations'
  }

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>

      {/* Search input */}
      <IntegrationSearch categorySlug={categorySlug} />

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

      {/* Integrations list */}
      {integrations.length === 0 ? (
        <p>{t('noResults')}</p>
      ) : (
        <div>
          {integrations.map((integration) => {
            const category = typeof integration.category === 'object' ? integration.category : null
            const image = typeof integration.image === 'object' ? integration.image : null

            return (
              <article key={integration.id}>
                {image && (
                  <Image
                    src={image.url || ''}
                    alt={image.alt || integration.title}
                    width={100}
                    height={100}
                  />
                )}
                <h3>{integration.title}</h3>
                <p>{integration.subtitle}</p>
                {category && (
                  <p>
                    {t('category')}: {category.title}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
