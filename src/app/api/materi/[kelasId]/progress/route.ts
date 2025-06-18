// File: app/api/materi/[kelasId]/progress/route.ts
// TAMBAHKAN CONSOLE.LOG UNTUK DEBUGGING

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

  if (!kelasId) {
    return NextResponse.json({ message: "Kelas ID is required" }, { status: 400 });
  }

  try {
    console.log(`\n--- Menghitung Progress untuk Kelas: ${kelasId}, User: ${userId} ---`);

    const allMateriInClass = await prisma.materi.findMany({
      where: { kelasId },
      include: {
        contents: {
          select: { id: true, weight: true, title: true },
        },
      },
    });

    if (allMateriInClass.length === 0) {
      console.log("Hasil: Tidak ada materi di kelas ini. Progress 0%.");
      return NextResponse.json({ progressPercent: 0 });
    }

    const userProgressRecords = await prisma.progress.findMany({
      where: {
        userId,
        materiContent: { materi: { kelasId: kelasId } },
      },
      select: { materiContentId: true },
    });

    const completedContentIds = new Set(userProgressRecords.map((p) => p.materiContentId));

    // --- DEBUG POINT 1 ---
    console.log("ID Konten yang Selesai:", Array.from(completedContentIds));

    let totalPercentageFromAllMateri = 0;

    for (const materi of allMateriInClass) {
      let progressForThisMateri = 0;
      if (materi.contents.length > 0) {
        for (const content of materi.contents) {
          if (completedContentIds.has(content.id)) {
            progressForThisMateri += content.weight;
          }
        }
      }
      // --- DEBUG POINT 2 ---
      console.log(`--> Progress untuk Materi "${materi.title}": ${progressForThisMateri}%`);
      totalPercentageFromAllMateri += progressForThisMateri;
    }

    const totalMateriCount = allMateriInClass.length;
    const finalClassProgress = totalPercentageFromAllMateri / totalMateriCount;
    const progressPercent = Math.round(finalClassProgress);

    // --- DEBUG POINT 3 ---
    console.log(`Total Akumulasi Persen: ${totalPercentageFromAllMateri}`);
    console.log(`Jumlah Materi: ${totalMateriCount}`);
    console.log(`Hasil Akhir (sebelum dibulatkan): ${finalClassProgress}%`);
    console.log(`Hasil Akhir (dikirim ke frontend): ${progressPercent}%`);
    console.log("--- Selesai Menghitung Progress ---\n");

    return NextResponse.json({
      progressPercent,
    });
  } catch (err) {
    console.error("🔥 Error calculating weighted class progress:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
