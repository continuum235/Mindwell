import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

function isStaleSessionSecretError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  const authError = error as Error & {
    type?: string
    cause?: { err?: Error }
  }

  return (
    authError.type === 'JWTSessionError' &&
    authError.cause?.err?.message.includes('no matching decryption secret') === true
  )
}

export async function getOptionalSession() {
  try {
    return await auth()
  } catch (error) {
    if (isStaleSessionSecretError(error)) {
      return null
    }

    throw error
  }
}

export async function requirePageSession() {
  const session = await getOptionalSession()

  if (!session?.user) {
    redirect('/login')
  }

  return session
}

export async function redirectAuthenticatedUser() {
  const session = await getOptionalSession()

  if (session?.user) {
    redirect('/')
  }
}

export async function ensureApiSession() {
  const session = await getOptionalSession()

  if (!session?.user) {
    return { session: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  return { session, response: null }
}
