// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// 1. Extend user yang dikembalikan oleh session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      deviceToken?: string;
      role?: string;
    } & DefaultSession["user"];
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    error?: string;
  }

  interface User extends DefaultUser {
    // deviceToken?: string;
    // googleAccessToken?: string;
    // googleIdToken?: string;
    // role?: string;
    role: string;
    deviceToken?: string | null;
    devTokenExpiredAt?: Date | null;
    googleAccessToken?: string | null;
    googleRefreshToken?: string | null;
    googleTokenExpiry?: Date | null;
  }

  interface JWT {
    access_token?: string;
  }
}

interface Session extends DefaultSession {
  user: {
    id: string;
    role: string;
  } & DefaultSession["user"];

  // Kirim access_token yang selalu aktif ke client
  accessToken: string;
  error?: string;
}
