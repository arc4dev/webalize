import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'news' })

  return (
    <main>
      <h1>Welcome to Webalize</h1>
      <p>Current locale: {locale}</p>
      <p>{t('title')}</p>
    </main>
  )
}
