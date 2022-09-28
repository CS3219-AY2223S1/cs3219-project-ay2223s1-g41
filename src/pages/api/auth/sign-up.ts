import { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        "Invalid input. Password should also be at least 7 characters long.",
    });
    return;
  }

  const client = await connectToDatabase();

  const db = client.db(process.env.MONGO_DB);
  const existingUser = await db
    .collection(process.env.MONGO_COLLECTION!)
    .findOne({ email: email });

  if (existingUser) {
    res.status(422).json({ message: "User already exists" });
    await client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  await db.collection(process.env.MONGO_COLLECTION!).insertOne({
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User created" });
  await client.close();
};

export default handler;
