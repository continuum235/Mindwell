import { NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getResources } from '@/lib/store'

export async function GET() {
  const { session, response } = await ensureApiSession()
  if (response) return response

  const resources = await getResources(session?.user?.email ?? undefined)
  return NextResponse.json(resources)
}
