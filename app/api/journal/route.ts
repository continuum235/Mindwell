import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getJournalEntries, saveJournalEntry } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  return NextResponse.json(await getJournalEntries())
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const body = (await request.json()) as { note?: string }

  if (!body.note?.trim()) {
    return NextResponse.json({ error: 'Journal note is required.' }, { status: 400 })
  }

  return NextResponse.json(await saveJournalEntry(body.note))
}
