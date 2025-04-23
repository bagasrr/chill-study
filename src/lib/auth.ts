import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma"; // ✅ tambah ini
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  // callbacks: {
  //   async signIn({ user }) {
  //     // logout semua session sebelumnya
  //     await prisma.session.deleteMany({
  //       where: { userId: user.id },
  //     });
  //     return true;
  //   },
  // },
  callbacks: {
    async session({ session, user }) {
      console.log("DEVICE TOKEN:", user.deviceToken);
      if (session.user) {
        session.user.deviceToken = user.deviceToken;
        session.user.role = user.role;
      }
      return session;
    },

    async signIn({ user, account }) {
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      // Update role ke STUDENT jika belum ada
      if (!existingUser?.role) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: "STUDENT",
          },
        });
      }

      // Generate device token seperti sebelumnya
      if (account?.provider === "google") {
        const token = randomUUID();
        await prisma.user.update({
          where: { id: user.id },
          data: {
            deviceToken: token,
          },
        });

        user.deviceToken = token;
      }

      return true;
    },
  },
};
