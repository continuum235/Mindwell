import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = typeof token.email === 'string' ? token.email : ''
        session.user.name = typeof token.name === 'string' ? token.name : session.user.name
      }
      return session
    },
  },
  providers: [], // Providers are added in the Node.js auth.ts
} satisfies NextAuthConfig
