import { NextResponse } from 'next/server'
import { ensureApiSession, getOptionalSession } from '@/lib/session'
import { getHomeSnapshot } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const session = await getOptionalSession()
  return NextResponse.json(await getHomeSnapshot(session?.user?.email ?? undefined))
}
