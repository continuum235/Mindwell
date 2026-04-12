import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession, getOptionalSession } from '@/lib/session'
import { getJournalEntries, saveJournalEntry } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const session = await getOptionalSession()
  const userEmail = session?.user?.email

  return NextResponse.json(await getJournalEntries(userEmail ?? undefined))
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const session = await getOptionalSession()
  const userEmail = session?.user?.email

  const body = (await request.json()) as { note?: string }

  if (!body.note?.trim()) {
    return NextResponse.json({ error: 'Journal note is required.' }, { status: 400 })
  }

  return NextResponse.json(await saveJournalEntry(body.note, userEmail ?? undefined))
}
