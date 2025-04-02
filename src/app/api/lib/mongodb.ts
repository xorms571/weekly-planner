import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) {
  throw new Error("MONGO_DB_URI is not defined in .env.local");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (!client) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  return (await clientPromise).db("mydatabase");
}