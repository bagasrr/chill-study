import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { kelasId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { kelasId } = params;
  const userId = session.user.id;

  try {
    // 1. Ambil semua materi di kelas
    const materiList = await prisma.materi.findMany({
      where: { kelasId },
      select: { id: true },
    });

    const materiIds = materiList.map((m) => m.id);

    // 2. Hitung materi yang sudah selesai
    const completedCount = await prisma.progress.count({
      where: {
        userId,
        status: true,
        materiId: { in: materiIds },
      },
    });

    const progressPercent = materiIds.length > 0 ? Math.round((completedCount / materiIds.length) * 100) : 0;

    // 3. Validasi progress 100%
    if (progressPercent < 100) {
      return new Response("Belum menyelesaikan semua materi", { status: 403 });
    }

    // 4. Ambil ujian
    const exam = await prisma.exam.findFirst({
      where: { kelasId },
      include: { questions: true },
    });

    if (!exam) {
      return new Response("Ujian tidak tersedia", { status: 404 });
    }

    const shuffled = exam.questions.sort(() => Math.random() - 0.5);

    return Response.json(shuffled);
  } catch (err) {
    console.error("🔥 ERROR DI API /kelas/[kelasId]/exam:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
