import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createMateriSchema } from "@/lib/validation/materi";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kelasName = searchParams.get("kelas"); // ambil query 'kelas'
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw && !isNaN(Number(limitRaw)) ? parseInt(limitRaw) : undefined;

  try {
    const materi = await prisma.materi.findMany({
      where: {
        IsDeleted: null,
        kelas: {
          title: kelasName || undefined, // filter berdasarkan nama kelas
          IsDeleted: null,
        },
      },
      select: {
        id: true,
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
            CompanyCode: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "asc",
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
    const session = await getServerSession(authOptions);

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
        CreatedBy: session?.user?.email || "system",
        CompanyCode: "Materi",
        Status: 1,
      },
    });

    return NextResponse.json(materi, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
