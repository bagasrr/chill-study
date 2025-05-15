import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { kelasId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { kelasId } = params;

  try {
    // Cek apakah user terdaftar di kelas ini
    const enrolled = await prisma.kelasUser.findUnique({
      where: {
        userId_kelasId: {
          userId,
          kelasId,
        },
      },
    });

    if (!enrolled) {
      return NextResponse.json({ message: "Not enrolled in this class" }, { status: 403 });
    }

    // Ambil semua materi di kelas
    const allMateri = await prisma.materi.findMany({
      where: { kelasId },
      select: { id: true },
    });

    const materiIds = allMateri.map((m) => m.id);

    // Ambil progress user yang sudah selesai (status = true)
    const completed = await prisma.progress.findMany({
      where: {
        userId,
        materiId: { in: materiIds },
        status: true,
      },
      select: {
        materiId: true,
        materi: {
          select: {
            id: true,
            title: true,
            content: true,
            videoUrl: true,
            createdAt: true,
            price: true,
            CreatedBy: true,
            LastUpdatedBy: true,
            LastUpdateDate: true,
          },
        },
      },
    });

    const progressPercent = materiIds.length > 0 ? Math.round((completed.length / materiIds.length) * 100) : 0;

    return NextResponse.json({
      totalMateri: materiIds.length,
      selesai: completed.length,
      progressPercent,
      materiCompleted: completed,
    });
  } catch (err) {
    console.error("🔥 Error kelas progress:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
