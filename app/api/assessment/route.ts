import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession } from '@/lib/session'
import { getAssessment, saveAssessmentAnswer } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  return NextResponse.json(await getAssessment())
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const body = (await request.json()) as { answer?: string }

  if (!body.answer?.trim()) {
    return NextResponse.json({ error: 'Assessment answer is required.' }, { status: 400 })
  }

  return NextResponse.json(await saveAssessmentAnswer(body.answer))
}
