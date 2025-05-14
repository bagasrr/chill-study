import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const kelas = await prisma.kelas.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        deskripsi: true,
        thumbnail: true,
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
        },
      },
    });
    return NextResponse.json(kelas);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
