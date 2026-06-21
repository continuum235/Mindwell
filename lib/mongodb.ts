import { MongoClient } from 'mongodb'

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined
}

export async function getDb() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    return null
  }

  try {
    const clientPromise =
      global.mongoClientPromise ??
      new MongoClient(uri, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      }).connect()

    global.mongoClientPromise = clientPromise

    const client = await clientPromise
    return client.db(process.env.MONGODB_DB || 'mindwell')
  } catch (error) {
    console.warn('MongoDB connection failed, falling back to memory store:', error instanceof Error ? error.message : error)
    global.mongoClientPromise = undefined
    return null
  }
}
