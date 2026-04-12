import { randomUUID } from 'node:crypto'
import { getDb } from '@/lib/mongodb'

interface RegisteredUser {
  id: string
  name: string
  email: string
  password: string
}

const memoryUsers = new Map<string, RegisteredUser>()

function normalizeEmail(email: string) {
  return email.toLowerCase().trim()
}

export async function findUserByEmail(email: string): Promise<RegisteredUser | null> {
  const normalizedEmail = normalizeEmail(email)
  const db = await getDb()

  if (!db) {
    return memoryUsers.get(normalizedEmail) ?? null
  }

  const collection = db.collection<RegisteredUser>('registered_users')
  return (await collection.findOne({ email: normalizedEmail })) ?? null
}

export async function createRegisteredUser(input: {
  name: string
  email: string
  password: string
}): Promise<RegisteredUser> {
  const user: RegisteredUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
  }

  const db = await getDb()

  if (!db) {
    memoryUsers.set(user.email, user)
    return user
  }

  const collection = db.collection<RegisteredUser>('registered_users')
  await collection.createIndex({ email: 1 }, { unique: true })
  await collection.insertOne(user)
  return user
}
