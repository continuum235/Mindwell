import { NextRequest, NextResponse } from 'next/server'
import { generateCompanionReply } from '@/lib/groq'
import { ensureApiSession, getOptionalSession } from '@/lib/session'
import { getChatMessages, saveChatExchange } from '@/lib/store'

export async function GET() {
  const { session, response } = await ensureApiSession()

  if (response) {
    return response
  }

  const userEmail = session?.user?.email

  return NextResponse.json(await getChatMessages(userEmail ?? undefined))
}

export async function POST(request: NextRequest) {
  const { session, response } = await ensureApiSession()

  if (response) {
    return response
  }

  const userEmail = session?.user?.email

  const body = (await request.json()) as { text?: string }

  if (!body.text?.trim()) {
    return NextResponse.json({ error: 'Message text is required.' }, { status: 400 })
  }

  try {
    const messages = await getChatMessages(userEmail ?? undefined)
    const reply = await generateCompanionReply(messages, body.text.trim())
    return NextResponse.json(await saveChatExchange(body.text.trim(), reply, userEmail ?? undefined))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to reach Groq.' },
      { status: 500 },
    )
  }
}
