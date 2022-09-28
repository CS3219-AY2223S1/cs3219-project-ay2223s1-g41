import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";

export default NextAuth({
  pages: {
    signIn: "/log-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client
          .db(process.env.MONGO_DB!)
          .collection(process.env.MONGO_COLLECTION!);

        const user = await usersCollection.findOne({
          email: credentials!.email,
        });

        if (!user) {
          await client.close();
          throw new Error("Invalid email");
        }

        const isValid = await verifyPassword(
          credentials!.password,
          user.password
        );

        if (!isValid) {
          await client.close();
          throw new Error("Invalid password");
        }

        await client.close();
        return {
          email: user.email,
          config: user.config,
        };
      },
    }),
  ],
});
