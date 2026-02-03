'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Modal } from '@/components/Modal'

type NavLink = {
  id?: string | null
  type?: ('header' | 'footer' | 'legal')[] | null
  label: string
  href: string
  children?:
    | {
        id?: string | null
        label: string
        href: string
      }[]
    | null
}

type MobileMenuProps = {
  links: NavLink[]
  locale: string
}

export function MobileMenu({ links, locale }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<'main' | string>('main')
  const [activeParent, setActiveParent] = useState<NavLink | null>(null)

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => {
    setIsOpen(false)
    // Reset navigation state after closing
    setTimeout(() => {
      setCurrentLevel('main')
      setActiveParent(null)
    }, 200)
  }

  const goToSubmenu = (link: NavLink) => {
    setActiveParent(link)
    setCurrentLevel(link.id || link.href)
  }

  const goBack = () => {
    setCurrentLevel('main')
    setActiveParent(null)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button onClick={openMenu} aria-label="Open mobile menu" aria-expanded={isOpen} type="button">
        <span>Menu</span>
      </button>

      {/* Mobile Menu in Modal Portal */}
      <Modal isOpen={isOpen} onClose={closeMenu} title="Navigation" fullScreen={true}>
        <nav>
          {/* Main Level */}
          {currentLevel === 'main' && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {links.map((link) => (
                <li key={link.id} style={{ marginBottom: '0.5rem' }}>
                  {link.children && link.children.length > 0 ? (
                    <button
                      onClick={() => goToSubmenu(link)}
                      type="button"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        background: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true">›</span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      style={{
                        display: 'block',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Submenu Level */}
          {currentLevel !== 'main' && activeParent && (
            <div>
              {/* Back Button */}
              <button
                onClick={goBack}
                type="button"
                style={{
                  marginBottom: '1rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span aria-hidden="true">‹</span>
                <span>Back</span>
              </button>

              {/* Parent Label */}
              <div style={{ marginBottom: '1rem' }}>
                <strong>{activeParent.label}</strong>
              </div>

              {/* Children Links */}
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {activeParent.children?.map((child) => (
                  <li key={child.id} style={{ marginBottom: '0.5rem' }}>
                    <Link
                      href={child.href}
                      onClick={closeMenu}
                      style={{
                        display: 'block',
                        padding: '0.75rem',
                        border: '1px solid #ddd',
                        textDecoration: 'none',
                      }}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </Modal>
    </>
  )
}
