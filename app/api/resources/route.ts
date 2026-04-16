import { NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getResources } from '@/lib/store'

export async function GET() {
  const { session, response } = await ensureApiSession()
  if (response) return response

  const resources = await getResources()
  return NextResponse.json(resources)
}
