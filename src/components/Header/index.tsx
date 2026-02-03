import { getPayload } from 'payload'
import config from '@payload-config'
import { Link } from '@/i18n/navigation'
import { MobileMenu } from '@/components/Header/MobileMenu'
import { LanguageSelector } from '@/components/Header/LanguageSelector'
import { BookCallTrigger } from '@/components/Header/BookCallTrigger'
import type { Locale } from '@/i18n/locales'

type HeaderProps = {
  locale: Locale
}

export async function Header({ locale }: HeaderProps) {
  const payload = await getPayload({ config })

  const navigation = await payload.findGlobal({
    slug: 'navigation',
    locale,
    fallbackLocale: 'pl',
  })

  // Filter links for header (exclude legal links)
  const headerLinks = navigation.links.filter((link) => link.type?.includes('header'))

  return (
    <header>
      <div>
        {/* Logo */}
        <Link href="/">
          <strong>Webalize</strong>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation">
          <ul>
            {headerLinks.map((link) => (
              <li key={link.id}>
                {link.children && link.children.length > 0 ? (
                  <details>
                    <summary>
                      <span>{link.label}</span>
                    </summary>
                    <ul>
                      {link.children.map((child) => (
                        <li key={child.id}>
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={link.href}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Book a Call CTA */}
        <BookCallTrigger />

        {/* Mobile Menu Toggle & Panel */}
        <MobileMenu links={headerLinks} locale={locale} />
      </div>
    </header>
  )
}
