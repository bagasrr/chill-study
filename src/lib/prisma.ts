// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

console.log("Prisma Client Loaded ✅");

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // boleh dihapus kalau gak mau nge-log query
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
