import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { kelasId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Autentikasi Pengguna
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { kelasId } = params;
    const userId = session.user.id;

    // 2. Periksa Progres Materi
    // Ambil semua konten materi (MateriContent) yang terkait dengan kelas ini
    const allMateriContent = await prisma.materiContent.findMany({
      where: {
        materi: {
          kelasId: kelasId,
        },
      },
      select: {
        id: true,
        weight: true, // Sertakan bobot untuk perhitungan progres
      },
    });

    const totalContentWeight = allMateriContent.reduce((sum, content) => sum + content.weight, 0);
    const materiContentIds = allMateriContent.map((mc) => mc.id);

    // Hitung total bobot progres yang sudah diselesaikan oleh pengguna
    const completedProgress = await prisma.progress.findMany({
      where: {
        userId,
        materiContentId: { in: materiContentIds },
      },
      select: {
        materiContent: {
          select: {
            weight: true,
          },
        },
      },
    });

    const completedWeight = completedProgress.reduce((sum, p) => sum + p.materiContent.weight, 0);

    // Hitung persentase progres
    const progressPercent = totalContentWeight > 0 ? Math.round((completedWeight / totalContentWeight) * 100) : 0;

    // Validasi: Pengguna harus menyelesaikan 100% materi
    if (progressPercent < 100) {
      return new Response("Belum menyelesaikan semua materi", { status: 403 });
    }

    // 3. Ambil Data Ujian
    const exam = await prisma.exam.findFirst({
      where: { kelasId },
      include: {
        questions: {
          // Hanya pilih bidang yang diperlukan dan JANGAN sertakan correctAnswer
          select: {
            id: true,
            questionText: true,
            questionImage: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            // correctAnswer TIDAK DISERTAKAN DI SINI untuk keamanan
          },
        },
      },
    });

    if (!exam) {
      return new Response("Ujian tidak tersedia", { status: 404 });
    }

    // 4. Acak Urutan Pertanyaan
    const shuffledQuestions = exam.questions.sort(() => Math.random() - 0.5);

    // 5. Kembalikan Respon Ujian
    return Response.json({ ...exam, questions: shuffledQuestions });
  } catch (err) {
    console.error("🔥 ERROR DI API /kelas/[kelasId]/exam:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
