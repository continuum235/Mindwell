import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getJournalEntries, saveJournalEntry } from '@/lib/store'

export async function GET() {
  const { session, response } = await ensureApiSession()
  if (response) return response

  return NextResponse.json(await getJournalEntries(session?.user?.email ?? undefined))
}

export async function POST(request: NextRequest) {
  const { session, response } = await ensureApiSession()
  if (response) return response
  const userEmail = session?.user?.email

  const body = (await request.json()) as { note?: string }

  if (!body.note?.trim()) {
    return NextResponse.json({ error: 'Journal note is required.' }, { status: 400 })
  }

  return NextResponse.json(await saveJournalEntry(body.note, userEmail ?? undefined))
}
