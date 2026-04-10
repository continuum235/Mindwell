import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function requirePageSession() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return session
}

export async function redirectAuthenticatedUser() {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }
}

export async function ensureApiSession() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
