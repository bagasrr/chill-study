// /app/api/admin/all-progress/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Ambil semua user dengan role STUDENT
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        kelasUser: {
          include: {
            kelas: true,
          },
        },
        progress: {
          where: { status: true },
          include: {
            materi: true, // tambahkan ini
          },
        },
      },
    });

    const allKelas = await prisma.kelas.findMany({
      include: {
        materi: {
          where: { IsDeleted: null },
          select: { id: true },
        },
      },
    });

    const report = students.map((student) => {
      const kelasProgress = student.kelasUser.map((ku) => {
        const kelasId = ku.kelasId;
        const namaKelas = ku.kelas.title;

        const totalMateri = allKelas.find((k) => k.id === kelasId)?.materi.length ?? 0;

        const selesai = student.progress.filter((p) => p.materi.kelasId === kelasId).length;

        const progressPercent = totalMateri > 0 ? Math.round((selesai / totalMateri) * 100) : 0;

        return {
          namaKelas,
          kelasId,
          totalMateri,
          selesai,
          progressPercent,
        };
      });

      return {
        userId: student.id,
        nama: student.name,
        email: student.email,
        progress: kelasProgress,
      };
    });

    return NextResponse.json(report);
  } catch (err) {
    console.error("🔥 Error get all user progress:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
