import type { Metadata } from 'next'
import { auth } from '@/auth'
import AuthProvider from '@/components/auth/auth-provider'
import AppShell from '@/components/layout/app-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mindwell',
  description: 'A private, compassionate space for daily reflection and somatic care.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

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
