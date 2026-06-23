import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  var prismaClient: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

export const prismaClient =
  globalThis.prismaClient ||
  new PrismaClient({
    adapter: connectionString ? new PrismaPg(new Pool({ connectionString })) : undefined,
    log: process.env.NODE_ENV === 'development' ? ['info', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaClient = prismaClient
}
