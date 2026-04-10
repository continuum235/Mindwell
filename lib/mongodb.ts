import { MongoClient } from 'mongodb'

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined
}

export async function getDb() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    return null
  }

  const clientPromise =
    global.mongoClientPromise ??
    new MongoClient(uri).connect()

  global.mongoClientPromise = clientPromise

  const client = await clientPromise

  return client.db(process.env.MONGODB_DB || 'mindwell')
}
