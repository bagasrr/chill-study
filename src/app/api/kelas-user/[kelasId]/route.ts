import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  try {
    const kelasUser = await prisma.kelasUser.findMany({
      where: {
        userId,
        IsDeleted: null,
      },
      include: {
        kelas: true, // ✅ supaya dapat info detail kelas
      },
      orderBy: {
        LastUpdateDate: "asc",
      },
    });

    return NextResponse.json(kelasUser);
  } catch (error) {
    console.error("🔥 API /kelas-user error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Pastikan nama folder route Anda adalah /api/kelas/[kelasId]/join/route.ts (contoh)
// Sehingga params yang diterima adalah { kelasId: string }
export async function POST(req: Request, { params }: { params: { kelasId: string } }) {
  try {
    // 1. Dapatkan sesi pengguna dan validasi
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      // Jika tidak ada sesi/user, kembalikan error Unauthorized
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { kelasId } = params;

    // 2. Periksa apakah pengguna sudah terdaftar di kelas ini sebelumnya
    const existingKelasUser = await prisma.kelasUser.findFirst({
      where: {
        userId: userId,
        kelasId: kelasId,
      },
    });

    if (existingKelasUser) {
      // Jika sudah ada, kembalikan data pendaftaran yang ada dengan status 200 OK.
      // Ini menandakan permintaan berhasil dan tidak ada data baru yang dibuat.
      return NextResponse.json(existingKelasUser, { status: 200 });
    }

    // 3. Jika belum terdaftar, buat entri baru
    const newKelasUser = await prisma.kelasUser.create({
      data: {
        userId: userId,
        kelasId: kelasId,
      },
    });

    // Kembalikan data yang baru dibuat dengan status 201 Created
    return NextResponse.json(newKelasUser, { status: 201 });
  } catch (error) {
    // 4. Tangani error tidak terduga
    console.error("ERROR_CREATE_KELAS_USER:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
