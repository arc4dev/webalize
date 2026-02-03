'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'

export function LanguageSelector() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('language')

  // Extract path without locale prefix
  const getPathWithoutLocale = () => {
    for (const loc of routing.locales) {
      if (pathname.startsWith(`/${loc}`)) {
        return pathname.slice(`/${loc}`.length) || '/'
      }
    }
    return pathname
  }

  const pathWithoutLocale = getPathWithoutLocale()

  return (
    <nav aria-label={t('select')}>
      <ul>
        {routing.locales.map((loc) => (
          <li key={loc}>
            {locale === loc ? (
              <strong>{t(loc)}</strong>
            ) : (
              <Link href={pathWithoutLocale} locale={loc}>
                {t(loc)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
