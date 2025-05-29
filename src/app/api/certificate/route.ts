import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { kelasId } = await req.json();
  const userId = session.user.id;

  if (!kelasId) {
    return NextResponse.json({ message: "kelasId is required" }, { status: 400 });
  }

  try {
    const existing = await prisma.certificate.findFirst({
      where: { userId, kelasId },
    });

    if (existing) {
      return NextResponse.json({ message: "Sertifikat sudah ada", certificate: existing });
    }

    const official = await prisma.official.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!official) {
      return NextResponse.json({ message: "Official tidak ditemukan" }, { status: 500 });
    }

    // ⬇️ INI dia generate nomor sertifikat di dalam POST
    const kelas = await prisma.kelas.findFirst({
      where: { id: kelasId },
      select: { CompanyCode: true },
    });

    const kodeKelas = (kelas?.CompanyCode || "XXXX").toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const number = `JCS-${kodeKelas}-${randomStr}-${timestamp}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        kelasId,
        officialId: official.id,
        number,
        pdfUrl: null,
      },
    });

    return NextResponse.json({ message: "Sertifikat berhasil dibuat", certificate });
  } catch (err) {
    console.error("❌ Error buat sertifikat:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // if (!session?.user || session.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const certificates = await prisma.certificate.findMany({
      include: {
        kelas: {
          select: {
            title: true,
            CompanyCode: true,
          },
        },
        official: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(certificates);
  } catch (err) {
    console.error("❌ Error fetch sertifikat:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
