// file: app/api/materi/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID Materi tidak ditemukan" }, { status: 400 });
  }

  try {
    const materi = await prisma.materi.findUnique({
      where: {
        id: id,
      },
      // PENTING: Sertakan semua item konten yang berhubungan dengan materi ini
      include: {
        contents: {
          orderBy: {
            // Anda bisa menambahkan urutan di sini jika modelnya memiliki field order
            // Misalnya: orderBy: { order: 'asc' }
          },
        },
      },
    });

    if (!materi) {
      return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(materi);
  } catch (error) {
    console.error(`Error fetching materi dengan ID: ${id}`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
