import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createKelasSchema } from "@/lib/validation/kelas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

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
      CreatedBy: session?.user?.email || "system",
      CompanyCode: "Kelas",
      Status: 1,
    },
  });

  return NextResponse.json(kelas, { status: 201 });
}

export async function GET() {
  try {
    const kelas = await prisma.kelas.findMany({
      where: { IsDeleted: null },
      select: {
        id: true,
        title: true,
        deskripsi: true,
        thumbnail: true,
        createdAt: true,
        CreatedBy: true,
        LastUpdatedBy: true,
        LastUpdateDate: true,
        CompanyCode: true,
        materi: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(kelas);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
