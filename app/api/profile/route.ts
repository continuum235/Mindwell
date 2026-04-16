import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession, getOptionalSession } from '@/lib/session'
import { getProfileSettings, updateProfileSettings } from '@/lib/store'

export async function GET() {
  const { session, response } = await ensureApiSession()
  if (response) return response
  return NextResponse.json(await getProfileSettings(session?.user?.email ?? undefined))
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const session = await getOptionalSession()

  const body = (await request.json()) as {
    dailyReminder?: boolean
    journalLock?: boolean
    anonymousInsights?: boolean
  }

  return NextResponse.json(await updateProfileSettings(body, session?.user?.email ?? undefined))
}
