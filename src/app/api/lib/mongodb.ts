import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise || (async () => {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  globalThis._mongoClientPromise = client.connect();
  return globalThis._mongoClientPromise;
})();

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("mydatabase");
}