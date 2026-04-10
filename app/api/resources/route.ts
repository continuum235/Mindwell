import { NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getResources } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  return NextResponse.json(await getResources())
}
