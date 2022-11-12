import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  return await MongoClient.connect(process.env.MONGO_URI as string);
}
