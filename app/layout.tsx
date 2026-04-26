import type { Metadata } from 'next'
import AuthProvider from '@/components/auth/auth-provider'
import AppShell from '@/components/layout/app-shell'
import { getOptionalSession } from '@/lib/session'
import './globals.css'

// Import bones registry (run `npx boneyard-js build` to generate bones first)
// import './bones/registry'

export const metadata: Metadata = {
  title: 'Mindwell',
  description: 'A private, compassionate space for daily reflection and somatic care.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getOptionalSession()

  return (
    <html lang="en">
      <body>
        <AuthProvider session={session}>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
