'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

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

  return (
    <header className="nav-shell">
      <div className="container nav-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <span className="brand-name">Mindwell</span>
            <span className="brand-tag">Somatic care, softly held</span>
          </div>
        </div>
        <nav className="nav-links" aria-label="Primary">
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
          {session?.user?.name ? <span className="nav-link">{session.user.name}</span> : null}
        </nav>
      </div>
    </header>
  )
}
