import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGO_DB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

let clientPromise: Promise<MongoClient>;

if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  globalThis._mongoClientPromise = client.connect();
}

clientPromise = globalThis._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("mydatabase");
}