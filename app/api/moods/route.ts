import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getMoods, saveMood } from '@/lib/store'

export async function GET() {
  const { session, response } = await ensureApiSession()
  if (response) return response
  return NextResponse.json(await getMoods(session?.user?.email ?? undefined))
}

export async function POST(request: NextRequest) {
  const { session, response } = await ensureApiSession()
  if (response) return response

  const body = (await request.json()) as { label?: string }

  if (!body.label) {
    return NextResponse.json({ error: 'Mood label is required.' }, { status: 400 })
  }

  return NextResponse.json(await saveMood(body.label, session?.user?.email ?? undefined))
}
