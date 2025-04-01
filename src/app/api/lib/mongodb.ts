import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("mydatabase");
}