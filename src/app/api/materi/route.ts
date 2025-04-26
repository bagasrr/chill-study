import { prisma } from "@/lib/prisma";
import { createMateriSchema } from "@/lib/schemas";
import { NextResponse } from "next/server";

// kelasId: true,

// GET semua materi
export async function GET() {
  try {
    const materi = await prisma.materi.findMany({
      select: {
        title: true,
        content: true,
        videoUrl: true,
        createdAt: true,
        price: true,
        CreatedBy: true,
        LastUpdatedBy: true,
        LastUpdateDate: true,
        kelas: {
          select: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json(materi);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST tambah materi baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createMateriSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    const { title, content, videoUrl, price, kelasId } = parsed.data;

    const materi = await prisma.materi.create({
      data: {
        title,
        content,
        videoUrl,
        price,
        kelasId,
      },
    });

    return NextResponse.json(materi, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
