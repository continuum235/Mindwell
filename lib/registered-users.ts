import bcrypt from 'bcryptjs'
import { prismaClient } from '@/lib/prisma'

interface RegisteredUser {
  id: string
  name: string
  email: string
  passwordHash: string
}

const memoryUsers = new Map<string, RegisteredUser>()

function normalizeEmail(email: string) {
  return email.toLowerCase().trim()
}

export async function findUserByEmail(email: string): Promise<RegisteredUser | null> {
  const normalizedEmail = normalizeEmail(email)

  try {
    const user = await prismaClient.registeredUser.findUnique({
      where: { email: normalizedEmail },
    })

    return user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          passwordHash: user.passwordHash,
        }
      : null
  } catch {
    // If database is unavailable, fall back to memory store
    return memoryUsers.get(normalizedEmail) ?? null
  }
}

export async function verifyUserPassword(user: RegisteredUser, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash)
}

export async function createRegisteredUser(input: {
  name: string
  email: string
  password: string
}): Promise<RegisteredUser> {
  const passwordHash = await bcrypt.hash(input.password, 12)

  const user: RegisteredUser = {
    id: globalThis.crypto.randomUUID(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordHash,
  }

  try {
    await prismaClient.registeredUser.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
      },
    })
  } catch {
    // If database is unavailable, fall back to memory store
    memoryUsers.set(user.email, user)
  }

  return user
}
