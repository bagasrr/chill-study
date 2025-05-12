import { prisma } from "@/lib/prisma";

export const getUserKelas = async (userId: string) => {
  const kelas = await prisma.kelasUser.findMany({
    where: { userId },
    include: { kelas: true },
  });
  return kelas;
};
