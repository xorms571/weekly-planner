import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) throw new Error("MONGO_DB_URI is not defined in .env.local");

const globalWithMongo = global as unknown as NodeJS.Global;

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalWithMongo._mongoClientPromise = client.connect();
}

const clientPromise = globalWithMongo._mongoClientPromise;

export async function connectToDatabase() {
  return (await clientPromise).db("mydatabase");
}
