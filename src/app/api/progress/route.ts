import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { materiId } = await req.json();
  const userId = session.user.id; // pastikan ID user tersedia di session

  if (!materiId) {
    return NextResponse.json({ message: "materiId required" }, { status: 400 });
  }

  // Cek apakah sudah ada progress
  const existing = await prisma.progress.findUnique({
    where: {
      userId_materiId: { userId, materiId },
    },
  });

  if (existing) {
    // Kalau sudah ada, update waktu terakhir diakses
    await prisma.progress.update({
      where: { id: existing.id },
      data: {
        LastUpdatedBy: session.user.email || "system",
        LastUpdateDate: new Date(),
        CreatedBy: session.user.name || "system",
      },
    });
  } else {
    // Kalau belum ada, buat baru
    await prisma.progress.create({
      data: {
        userId,
        materiId,
        CreatedBy: session.user.email || "system",
      },
    });
  }

  return NextResponse.json({ message: "Progress saved/updated." });
}
