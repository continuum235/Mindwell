import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getMoods, saveMood } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  return NextResponse.json(await getMoods())
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const body = (await request.json()) as { label?: string }

  if (!body.label) {
    return NextResponse.json({ error: 'Mood label is required.' }, { status: 400 })
  }

  return NextResponse.json(await saveMood(body.label))
}
