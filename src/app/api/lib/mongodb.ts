import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
if (!uri) throw new Error("MONGO_DB_URI is not defined in .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  return (await clientPromise).db("mydatabase");
}