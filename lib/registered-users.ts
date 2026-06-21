import bcrypt from 'bcryptjs'

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
  const { getDb } = await import('@/lib/mongodb')
  const db = await getDb()

  if (!db) {
    return memoryUsers.get(normalizedEmail) ?? null
  }

  const collection = db.collection<RegisteredUser>('registered_users')
  return (await collection.findOne({ email: normalizedEmail })) ?? null
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

  const { getDb } = await import('@/lib/mongodb')
  const db = await getDb()

  if (!db) {
    memoryUsers.set(user.email, user)
    return user
  }

  const collection = db.collection<RegisteredUser>('registered_users')
  await collection.insertOne(user)
  return user
}
