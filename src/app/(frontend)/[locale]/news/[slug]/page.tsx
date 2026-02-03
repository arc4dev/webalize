import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { RichText } from '@/components/RichText'
import { calculateReadTime } from '@/utilities/calculateReadTime'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import type { Locale } from '@/i18n/locales'
import { getAllNews, getNewsBySlug, getRelatedNews } from '@/data-access/news'

type Props = {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams() {
  const newsPosts = await getAllNews()

  // Generate params for all locales
  const params = newsPosts.flatMap((post) => [
    { locale: 'pl', slug: post.slug },
    { locale: 'en', slug: post.slug },
  ])

  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params

  const post = await getNewsBySlug({ locale, slug, depth: 1, skipDraftMode: true })

  if (!post) {
    return {}
  }

  const ogImage =
    typeof post.heroImage === 'object' && post.heroImage?.url ? post.heroImage.url : undefined

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'news' })

  // Fetch the news post using cached function
  const post = await getNewsBySlug({ locale, slug, depth: 2 })

  if (!post) {
    notFound()
  }

  // Calculate read time
  const readTime = calculateReadTime(post.content)

  // Format published date
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // Get category
  const category = typeof post.category === 'object' ? post.category : null

  // Fetch related news (same category, exclude current post, limit 3)
  const relatedNews = await getRelatedNews({
    locale,
    currentPostId: post.id,
    categoryId: category?.id,
    limit: 3,
  })

  // Get hero image
  const heroImage = typeof post.heroImage === 'object' ? post.heroImage : null

  return (
    <article>
      {/* Title */}
      <header>
        <h1>{post.title}</h1>

        {/* Meta information */}
        <div>
          {publishedDate && <time dateTime={post.publishedAt || undefined}>{publishedDate}</time>}
          {publishedDate && ' · '}
          <span>{readTime}</span>
          {category && (
            <>
              {' · '}
              <Link href={`/news?category=${category.slug}`}>{category.title}</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Image */}
      {heroImage && heroImage.url && (
        <figure>
          <Image
            src={heroImage.url}
            alt={heroImage.alt || post.title || ''}
            width={heroImage.width || 1920}
            height={heroImage.height || 1080}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </figure>
      )}

      {/* Rich Text Content */}
      {post.content && <RichText data={post.content} />}

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <aside>
          <h2>{t('relatedNews')}</h2>
          <div>
            {relatedNews.map((relatedPost) => {
              const relatedCategory =
                typeof relatedPost.category === 'object' ? relatedPost.category : null
              const relatedHeroImage =
                typeof relatedPost.heroImage === 'object' ? relatedPost.heroImage : null

              return (
                <article key={relatedPost.id}>
                  {relatedHeroImage && relatedHeroImage.url && (
                    <Link href={`/news/${relatedPost.slug}`}>
                      <Image
                        src={relatedHeroImage.url}
                        alt={relatedHeroImage.alt || relatedPost.title || ''}
                        width={400}
                        height={225}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Link>
                  )}
                  <h3>
                    <Link href={`/news/${relatedPost.slug}`}>{relatedPost.title}</Link>
                  </h3>
                  {relatedCategory && <p>{relatedCategory.title}</p>}
                  {relatedPost.excerpt && <p>{relatedPost.excerpt}</p>}
                  <Link href={`/news/${relatedPost.slug}`}>{t('readMore')}</Link>
                </article>
              )
            })}
          </div>
        </aside>
      )}
    </article>
  )
}
