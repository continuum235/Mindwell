import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, addRegisteredUser } from '@/lib/registered-users'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = findUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 })
    }

    // Create user (store plaintext for now - in production use proper hashing)
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name: name.trim(),
      email: normalizedEmail,
      password: password,
    }

    addRegisteredUser(newUser)

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}
