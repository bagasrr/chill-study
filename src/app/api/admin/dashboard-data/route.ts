// /app/api/admin/dashboard-data/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pastikan path ini benar

export async function GET() {
  try {
    // 1. Ambil semua siswa (role STUDENT)
    // Hapus klausa 'where' di dalam 'include.kelas.where' karena tidak didukung
    const students = await prisma.user.findMany({
      where: { role: "STUDENT", IsDeleted: null }, // Hanya siswa aktif
      include: {
        kelasUser: {
          where: { IsDeleted: null }, // Ini memfilter KelasUser (enrollment) yang tidak dihapus
          include: {
            kelas: true, // Ambil semua data kelas yang terhubung
          },
        },
        progress: {
          include: {
            materiContent: {
              select: {
                id: true,
                weight: true,
                materi: {
                  select: {
                    kelasId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 2. Ambil semua MateriContent untuk semua kelas aktif
    // Perbaikan di sini: Pastikan MateriContent yang diambil hanya dari Materi dan Kelas yang aktif.
    const allActiveMateriContent = await prisma.materiContent.findMany({
      where: {
        materi: {
          IsDeleted: null, // Hanya materi aktif
          kelas: {
            IsDeleted: null, // Hanya kelas aktif
          },
        },
      },
      select: {
        id: true,
        weight: true,
        materi: {
          select: {
            kelasId: true,
          },
        },
      },
    });

    // 3. Olah data untuk laporan dan chart
    const processedStudentsData = students.map((student) => {
      // Filter 'kelasUser' di sini untuk hanya menyertakan kelas yang tidak dihapus
      const activeKelasUser = student.kelasUser.filter((ku) => ku.kelas.IsDeleted === null);

      const kelasProgress = activeKelasUser.map((ku) => {
        const kelasId = ku.kelasId;
        const namaKelas = ku.kelas.title;

        // Filter materi konten untuk kelas ini
        const materiContentForThisKelas = allActiveMateriContent.filter((mc) => mc.materi.kelasId === kelasId);

        // Hitung total bobot dan jumlah materi content untuk kelas ini
        const totalContentWeight = materiContentForThisKelas.reduce((sum, mc) => sum + mc.weight, 0);
        const totalMateriContentCount = materiContentForThisKelas.length;

        // Filter progress siswa yang terkait dengan materi konten di kelas ini
        const studentProgressForThisKelas = student.progress.filter((p) => p.materiContent?.materi.kelasId === kelasId);

        // Hitung bobot progres yang telah diselesaikan oleh siswa untuk kelas ini
        const completedWeight = studentProgressForThisKelas.reduce((sum, p) => sum + (p.materiContent?.weight || 0), 0);
        const completedMateriContentCount = studentProgressForThisKelas.length;

        const progressPercent = totalContentWeight > 0 ? Math.round((completedWeight / totalContentWeight) * 100) : 0;

        return {
          namaKelas,
          kelasId,
          totalMateriContent: totalMateriContentCount, // Jumlah item materi content
          completedMateriContentCount: completedMateriContentCount, // Jumlah item materi content yang diselesaikan
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

    // Data agregat untuk ringkasan dan charting
    const totalStudents = students.length;
    // Mengambil ID kelas unik dari kelasUser yang aktif
    const totalKelasAkses = new Set(processedStudentsData.flatMap((s) => s.progress.map((p) => p.kelasId))).size;

    // Untuk chart: Misalnya, rata-rata progres per kelas
    const kelasProgressOverview: {
      kelasId: string;
      namaKelas: string;
      averageProgress: number;
      studentsCount: number;
    }[] = [];

    // Ambil daftar unik kelas yang memiliki progres atau terdaftar
    const uniqueKelasMap = new Map<string, { id: string; title: string }>();
    processedStudentsData.forEach((student) => {
      student.progress.forEach((p) => {
        if (!uniqueKelasMap.has(p.kelasId)) {
          uniqueKelasMap.set(p.kelasId, { id: p.kelasId, title: p.namaKelas });
        }
      });
    });
    const uniqueKelas = Array.from(uniqueKelasMap.values());

    uniqueKelas.forEach((kelas) => {
      let totalProgressSum = 0;
      let studentsInKelas = 0;
      processedStudentsData.forEach((student) => {
        const kelasEntry = student.progress.find((p) => p.kelasId === kelas.id);
        if (kelasEntry) {
          totalProgressSum += kelasEntry.progressPercent;
          studentsInKelas++;
        }
      });

      kelasProgressOverview.push({
        kelasId: kelas.id,
        namaKelas: kelas.title,
        averageProgress: studentsInKelas > 0 ? Math.round(totalProgressSum / studentsInKelas) : 0,
        studentsCount: studentsInKelas,
      });
    });

    return NextResponse.json({
      summary: {
        totalStudents,
        totalKelasAkses,
      },
      studentsData: processedStudentsData,
      kelasProgressOverview, // Data untuk chart
    });
  } catch (err) {
    console.error("🔥 Error fetching dashboard data:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
