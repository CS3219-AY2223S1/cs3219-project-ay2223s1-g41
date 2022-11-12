import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword, verifyPassword } from "../../../lib/auth";

import { connectToDatabase } from "../../../lib/db";
import { getSession } from "next-auth/react";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user!.email;

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollection = client
    .db(process.env.MONGO_DB)
    .collection(process.env.MONGO_COLLECTION!);

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    await client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password." });
    await client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  await client.close();
  res.status(200).json({ message: "Password updated!" });
}

export default handler;
