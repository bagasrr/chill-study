import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

// Middleware soft delete
prisma.$use(async (params: any, next: any) => {
  if (["User", "Kelas", "Materi"].includes(params.model ?? "")) {
    if (params.action === "findMany" || params.action === "findFirst") {
      if (!params.args) params.args = {};
      if (!params.args.where) params.args.where = {};
      params.args.where.IsDeleted = null;
    }
  }
  return next(params);
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
