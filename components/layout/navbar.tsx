'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/mood', label: 'Mood Tracker' },
  { href: '/journal', label: 'Journal' },
  { href: '/companion', label: 'Companion' },
  { href: '/stress', label: 'Resources' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/profile', label: 'Profile' },
]

export default function NavBar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false) // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header className="nav-shell">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <span className="brand-name">Mindwell</span>
            <span className="brand-tag">Somatic care, softly held</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-only" aria-label="Primary">
          {links.map((link) => {
            const isActive = pathname === link.href
            const className = `nav-link${isActive ? ' active' : ''}`

            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            )
          })}
          {isAuthenticated ? (
            <button
              className="nav-link nav-link-cta"
              type="button"
              onClick={() => void signOut({ callbackUrl: '/login' })}
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" className={`nav-link nav-link-cta${pathname === '/login' ? ' active' : ''}`}>
              Login
            </Link>
          )}
          {session?.user?.name ? <span className="nav-link user-name">{session.user.name}</span> : null}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mobile-menu-inner">
                <nav className="mobile-nav-links">
                  {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`mobile-nav-link${isActive ? ' active' : ''}`}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                  <div className="mobile-nav-divider" />
                  {isAuthenticated ? (
                    <button
                      className="mobile-nav-link mobile-nav-cta"
                      type="button"
                      onClick={() => void signOut({ callbackUrl: '/login' })}
                    >
                      Sign out
                    </button>
                  ) : (
                    <Link href="/login" className="mobile-nav-link mobile-nav-cta">
                      Login
                    </Link>
                  )}
                  {session?.user?.name && (
                    <span className="mobile-user-name">Signed in as {session.user.name}</span>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
