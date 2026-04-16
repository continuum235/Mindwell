import { NextResponse } from 'next/server'
import { ensureApiSession, getOptionalSession } from '@/lib/session'
import { getHomeSnapshot } from '@/lib/store'

export async function GET() {
  const { session, response } = await ensureApiSession()

  if (response) {
    return response
  }

  return NextResponse.json(await getHomeSnapshot(session?.user?.email ?? undefined))
}
