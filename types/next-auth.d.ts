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
  }

  interface User extends DefaultUser {
    deviceToken?: string;
    role?: string;
  }
}
