// MongoDB support is commented out per request.
// The app can still import getDb(), but it will no longer attempt a MongoDB connection.

/* import { MongoClient } from 'mongodb'

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
    console.warn(
      'MongoDB connection failed, falling back to memory store:',
      error instanceof Error ? error.message : error,
    )
    global.mongoClientPromise = undefined
    return null
  }
}
*/

export async function getDb() {
  return null
}
