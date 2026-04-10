import type { ReactNode } from 'react'
import NavBar from '@/components/layout/navbar'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="ambient-shape shape-1" aria-hidden="true" />
      <div className="ambient-shape shape-2" aria-hidden="true" />
      <NavBar />
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <div className="container footer-inner">
          <p>Mindwell is a gentle space for grounded, daily care.</p>
          <span>Move slowly. Listen deeply. Return often.</span>
        </div>
      </footer>
    </div>
  )
}
