import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { randomUUID } from "crypto";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database", // Gunakan database biar bisa kontrol login
  },

  callbacks: {
    async jwt({ token, account, user }) {
      console.log({ akun: account });
      const now = Date.now();

      // Kalau user baru login
      if (account && user) {
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at * 1000;

        // Simpan juga ke DB
        await prisma.user.update({
          where: { email: user.email },
          data: {
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleIdToken: account.id_token,
            googleTokenExpiry: new Date(account.expires_at * 1000),
          },
        });
      }

      // Auto refresh token kalau expired
      if (token.expires_at && Date.now() > token.expires_at) {
        try {
          const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token!,
            }),
          });

          const refreshed = await refreshRes.json();
          if (refreshed.access_token) {
            token.access_token = refreshed.access_token;
            token.expires_at = Date.now() + refreshed.expires_in * 1000;

            await prisma.user.update({
              where: { email: token.email! },
              data: {
                googleAccessToken: refreshed.access_token,
                googleTokenExpiry: new Date(token.expires_at),
              },
            });
          }
        } catch (err) {
          console.error("Failed to refresh access token:", err);
        }
      }
      console.log({ tokenTerakhir: token });
      return token;
    },

    async session({ session, user }) {
      // Inject field tambahan ke session
      if (session.user) {
        session.user.id = user.id;
        session.user.deviceToken = user.deviceToken;
        session.user.role = user.role;
      }
      // Inject access_token dari DB (kita simpan manual saat login)
      session.id_token = user.googleIdToken as string;
      session.access_token = user.googleAccessToken as string;
      console.log({ sessionTerakhir: session });
      return session;
    },

    async signIn({ user, account }) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        const now = new Date();

        // ❌ Jika deviceToken masih aktif, tolak login
        if (existingUser?.deviceToken && existingUser?.devTokenExpiredAt && existingUser.devTokenExpiredAt > now) {
          return "/auth/error?error=DeviceActive";
        }

        // 🔄 Set default role kalau belum ada
        if (existingUser && !existingUser.role) {
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              role: "STUDENT",
            },
          });
        }

        // 🔐 Generate deviceToken baru
        const deviceToken = randomUUID();
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 3);

        // ✅ Simpan deviceToken + access_token Google ke DB
        if (account?.provider === "google" && existingUser) {
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              deviceToken,
              devTokenExpiredAt: expiredAt,
              googleAccessToken: account.access_token || null,
              googleRefreshToken: account.refresh_token || null,
              googleIdToken: account.id_token || null,
            },
          });

          user.deviceToken = deviceToken;
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },

  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "STUDENT",
          deviceToken: randomUUID(),
          CreatedBy: "System",
          LastUpdatedBy: "System",
          Status: 1,
          CompanyCode: "User",
        },
      });
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
