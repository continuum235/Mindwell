import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/auth/signin with NextAuth credentials authentication.' },
    { status: 410 },
  )
}
