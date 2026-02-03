import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { RichText } from '@/components/RichText'
import type { Metadata } from 'next'
import type { Locale } from '@/i18n/locales'
import { getFAQByLocale } from '@/data-access/faq'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'faq' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'faq' })

  // Fetch FAQ data using data-access layer
  const { categories, faqItems } = await getFAQByLocale(locale)

  // Group FAQs by category
  const faqsByCategory = new Map<number, typeof faqItems>()
  categories.forEach((category) => {
    const categoryFaqs = faqItems.filter((faq) => {
      const faqCategory = typeof faq.category === 'object' ? faq.category : null
      return faqCategory?.id === category.id
    })
    if (categoryFaqs.length > 0) {
      faqsByCategory.set(category.id, categoryFaqs)
    }
  })

  return (
    <div>
      <header>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
      </header>

      {/* FAQ Items grouped by category */}
      {faqsByCategory.size === 0 ? (
        <p>{t('noResults')}</p>
      ) : (
        <>
          {categories.map((category) => {
            const categoryFaqs = faqsByCategory.get(category.id)
            if (!categoryFaqs || categoryFaqs.length === 0) return null

            return (
              <section key={category.id}>
                <h2>{category.title}</h2>
                {category.subtitle && <p>{category.subtitle}</p>}

                <div>
                  {categoryFaqs.map((faq) => (
                    <details key={faq.id}>
                      <summary>{faq.question}</summary>
                      {faq.answer && <RichText data={faq.answer} />}
                    </details>
                  ))}
                </div>
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}
