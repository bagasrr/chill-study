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
  }

  interface User extends DefaultUser {
    deviceToken?: string;
    googleAccessToken?: string;
    googleIdToken?: string;
    role?: string;
  }

  interface JWT {
    access_token?: string;
  }
}
