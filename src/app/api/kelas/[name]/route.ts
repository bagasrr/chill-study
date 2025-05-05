import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { name: string } }) {
  const { name } = params;
  try {
    const kelas = await prisma.kelas.findUnique({
      where: { CompanyCode: name, IsDeleted: null },
      select: {
        id: true,
        title: true,
        deskripsi: true,
        thumbnail: true,
        createdAt: true,
        CreatedBy: true,
        LastUpdatedBy: true,
        LastUpdateDate: true,
        materi: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    return NextResponse.json(kelas);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
