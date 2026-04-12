import { NextRequest, NextResponse } from 'next/server'
import { ensureApiSession, getOptionalSession } from '@/lib/session'
import { getAssessment, moveAssessment, saveAssessmentAnswer } from '@/lib/store'

export async function GET() {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const session = await getOptionalSession()
  return NextResponse.json(await getAssessment(session?.user?.email ?? undefined))
}

export async function POST(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const session = await getOptionalSession()

  const body = (await request.json()) as { answer?: string }

  if (!body.answer?.trim()) {
    return NextResponse.json({ error: 'Assessment answer is required.' }, { status: 400 })
  }

  return NextResponse.json(await saveAssessmentAnswer(body.answer, session?.user?.email ?? undefined))
}

export async function PATCH(request: NextRequest) {
  const unauthorized = await ensureApiSession()

  if (unauthorized) {
    return unauthorized
  }

  const session = await getOptionalSession()
  const body = (await request.json()) as { action?: 'back' | 'continue' | 'reset' }

  if (!body.action) {
    return NextResponse.json({ error: 'Assessment action is required.' }, { status: 400 })
  }

  return NextResponse.json(await moveAssessment(body.action, session?.user?.email ?? undefined))
}
