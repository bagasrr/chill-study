import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { namakelas: string } }) {
  const { namakelas } = params;
  try {
    const kelas = await prisma.kelas.findFirst({
      where: {
        CompanyCode: namakelas,
        IsDeleted: null,
      },
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
            price: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return NextResponse.json(kelas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
