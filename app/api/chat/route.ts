import { NextRequest, NextResponse } from 'next/server'
import { generateCompanionReply } from '@/lib/groq'
import { ensureApiSession } from '@/lib/session'
import { getChatMessages, saveChatExchange } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  return NextResponse.json(await getChatMessages())
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const body = (await request.json()) as { text?: string }

  if (!body.text?.trim()) {
    return NextResponse.json({ error: 'Message text is required.' }, { status: 400 })
  }

  try {
    const messages = await getChatMessages()
    const reply = await generateCompanionReply(messages, body.text.trim())
    return NextResponse.json(await saveChatExchange(body.text.trim(), reply))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to reach Groq.' },
      { status: 500 },
    )
  }
}
