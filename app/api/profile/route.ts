import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getProfileSettings, updateProfileSettings } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  return NextResponse.json(await getProfileSettings())
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const body = (await request.json()) as {
    dailyReminder?: boolean
    journalLock?: boolean
    anonymousInsights?: boolean
  }

  return NextResponse.json(await updateProfileSettings(body))
}
