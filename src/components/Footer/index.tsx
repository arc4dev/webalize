import { getPayload } from 'payload'
import config from '@payload-config'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/locales'

type FooterProps = {
  locale: Locale
}

export async function Footer({ locale }: FooterProps) {
  const payload = await getPayload({ config })

  const navigation = await payload.findGlobal({
    slug: 'navigation',
    locale,
    fallbackLocale: 'pl',
  })

  const footerData = await payload.findGlobal({
    slug: 'footer',
    locale,
    fallbackLocale: 'pl',
  })

  const globalSettings = await payload.findGlobal({
    slug: 'global',
    locale,
    fallbackLocale: 'pl',
  })

  const footerLinks = navigation.links.filter((link) => link.type?.includes('footer'))
  const legalLinks = navigation.links.filter((link) => link.type?.includes('legal'))

  const currentYear = new Date().getFullYear()
  const copyrightText = footerData.copyrightText?.replace('{year}', currentYear.toString())

  return (
    <footer>
      <div>
        {/* Footer Navigation Columns */}
        {footerLinks.length > 0 && (
          <div>
            {footerLinks.map((link) => (
              <div key={link.id}>
                {link.children && link.children.length > 0 ? (
                  <>
                    <h3>{link.label}</h3>
                    <ul>
                      {link.children.map((child) => (
                        <li key={child.id}>
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={link.href}>
                    <h3>{link.label}</h3>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Info Column */}
        {globalSettings.contactInfo && (
          <div>
            <h3>Contact</h3>
            <ul>
              {globalSettings.contactInfo.email && (
                <li>
                  <a href={`mailto:${globalSettings.contactInfo.email}`}>
                    {globalSettings.contactInfo.email}
                  </a>
                </li>
              )}
              {globalSettings.contactInfo.phone && (
                <li>
                  <a href={`tel:${globalSettings.contactInfo.phone}`}>
                    {globalSettings.contactInfo.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Social Links */}
      {footerData.socialLinks && footerData.socialLinks.length > 0 && (
        <div>
          <nav aria-label="Social media">
            <ul>
              {footerData.socialLinks.map((social, index) => (
                <li key={index}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Bottom Bar: Legal Links + Copyright */}
      <div>
        {/* Legal Links */}
        {legalLinks.length > 0 && (
          <nav aria-label="Legal">
            <ul>
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Copyright */}
        {copyrightText && <p>{copyrightText}</p>}
      </div>
    </footer>
  )
}
