import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getLoginUser } from '@/lib/store'
import { findUserByEmail, verifyUserPassword } from '@/lib/registered-users'
import { authConfig } from './auth.config'

function isStaleSessionSecretError(error: Error) {
  const authError = error as Error & {
    type?: string
    cause?: { err?: Error }
  }

  return (
    authError.type === 'JWTSessionError' &&
    authError.cause?.err?.message.includes('no matching decryption secret') === true
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(rawCredentials) {
        const email =
          typeof rawCredentials?.email === 'string' ? rawCredentials.email.trim().toLowerCase() : ''
        const password =
          typeof rawCredentials?.password === 'string' ? rawCredentials.password : ''

        if (!email || !password) {
          return null
        }

        // Check registered users first
        const registeredUser = await findUserByEmail(email)
        if (registeredUser && await verifyUserPassword(registeredUser, password)) {
          return {
            id: registeredUser.id,
            email: registeredUser.email,
            name: registeredUser.name,
          }
        }

        // Fall back to demo user
        const appUser = await getLoginUser()
        const configuredPassword = process.env.AUTH_PASSWORD || 'mindwell-demo'

        if (email !== appUser.email.toLowerCase() || password !== configuredPassword) {
          return null
        }

        return {
          id: appUser.email,
          email: appUser.email,
          name: appUser.name,
        }
      },
    }),
  ],
})
