import { prisma } from "@/lib/prisma";
import { createKelasSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

// GET semua kelas
export async function GET() {
  try {
    const kelas = await prisma.kelas.findMany({
      select: {
        // id: true,
        title: true,
        deskripsi: true,
        thumbnail: true,
        createdAt: true,
        // Field lain yang mau tampil bisa ditambahin
      },
    });
    return NextResponse.json(kelas);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST tambah kelas baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createKelasSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    const { title, deskripsi, thumbnail } = parsed.data;

    const kelas = await prisma.kelas.create({
      data: {
        title,
        deskripsi,
        thumbnail,
      },
    });

    return NextResponse.json(kelas, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
