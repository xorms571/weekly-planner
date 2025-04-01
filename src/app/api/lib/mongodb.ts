import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("MONGO_DB_URI is not defined in .env.local");
}

let client: MongoClient;
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ||
  (async () => {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    global._mongoClientPromise = client.connect();
    return global._mongoClientPromise;
  })();

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("mydatabase");
}