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
  const userId = session.user.id;

  if (!materiId) {
    return NextResponse.json({ message: "materiId required" }, { status: 400 });
  }

  try {
    // Ambil data materi + kelasnya
    const materi = await prisma.materi.findUnique({
      where: { id: materiId },
      include: { kelas: true },
    });

    if (!materi) {
      return NextResponse.json({ message: "Materi not found" }, { status: 404 });
    }

    // ❌ Kalau materi berbayar dan user belum punya akses, tolak
    if (materi.price > 0) {
      const hasAccess = await prisma.kelasUser.findUnique({
        where: {
          userId_kelasId: {
            userId,
            kelasId: materi.kelasId,
          },
        },
      });

      if (!hasAccess) {
        return NextResponse.json(
          {
            message: "Payment required to access this materi.",
            need_payment: true,
            kelasId: materi.kelasId,
            materiTitle: materi.title,
            materiPrice: materi.price,
          },
          { status: 200 }
        ); // status 200 karena ini bukan error, tapi info
      }
    }

    // ✅ Kalau materi gratis dan user belum punya kelas, enroll otomatis
    if (materi.price === 0) {
      const enrolled = await prisma.kelasUser.findUnique({
        where: {
          userId_kelasId: {
            userId,
            kelasId: materi.kelasId,
          },
        },
      });

      if (!enrolled) {
        await prisma.kelasUser.create({
          data: {
            userId,
            kelasId: materi.kelasId,
            CreatedBy: session.user.email || "system",
            CompanyCode: "KelasUser",
            Status: 1,
            LastUpdateDate: new Date(),
            LastUpdatedBy: session.user.email || "system",
          },
        });
      }
    }

    // 🚀 Simpan atau update progress
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_materiId: {
          userId,
          materiId,
        },
      },
    });

    if (existingProgress) {
      await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          LastUpdatedBy: session.user.email || "system",
          LastUpdateDate: new Date(),
        },
      });
    } else {
      await prisma.progress.create({
        data: {
          userId,
          materiId,
          CreatedBy: session.user.email || "system",
          CompanyCode: "Progress",
          Status: 1,
        },
      });
    }

    return NextResponse.json({ message: "Progress saved successfully." });
  } catch (error) {
    console.error("🔥 Error in progress API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
