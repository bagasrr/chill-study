import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
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
    strategy: "database", // kamu pakai database, jadi tetap gunakan ini
  },
  callbacks: {
    async session({ session, user }) {
      // Inject deviceToken & role ke session
      if (session.user) {
        session.user.deviceToken = user.deviceToken;
        session.user.role = user.role;
      }
      return session;
    },

    signIn: async ({ user, account }) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }, // GUNAKAN EMAIL untuk menghindari error saat akun baru
        });

        // Kalau ada token & belum expired -> blok login
        if (existingUser?.deviceToken && existingUser?.devTokenExpiredAt) {
          const now = new Date();
          if (existingUser.devTokenExpiredAt > now) {
            return "/auth/error?error=DeviceActive";
          }
        }

        // Jika belum ada role, set default STUDENT
        if (existingUser && !existingUser.role) {
          await prisma.user.update({
            where: { email: user.email! },
            data: { role: "STUDENT" },
          });
        }

        // Generate & simpan deviceToken saat login via Google
        if (account?.provider === "google" && existingUser) {
          const token = randomUUID();
          const expiredAt = new Date();
          expiredAt.setHours(expiredAt.getHours() + 3);

          await prisma.user.update({
            where: { email: user.email! },
            data: {
              deviceToken: token,
              devTokenExpiredAt: expiredAt,
            },
          });

          user.deviceToken = token;
        }

        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    },
  },

  events: {
    async createUser({ user }) {
      // Dipanggil saat user baru berhasil dibuat
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "STUDENT", deviceToken: randomUUID() },
      });
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
