import type { Metadata } from 'next'
import AuthProvider from '@/components/auth/auth-provider'
import NavBar from '@/components/layout/navbar'
import { getOptionalSession } from '@/lib/session'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mindwell',
  description: 'A private, compassionate space for daily reflection and somatic care.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getOptionalSession()

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider session={session}>
          <div className="app-shell">
            <div className="ambient-shape shape-1" aria-hidden="true" />
            <div className="ambient-shape shape-2" aria-hidden="true" />
            <NavBar />
            <main className="app-main">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
