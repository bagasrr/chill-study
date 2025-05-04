import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const materi = await prisma.materi.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        videoUrl: true,
        price: true,
        CreatedBy: true,
        LastUpdatedBy: true,
        LastUpdateDate: true,
        kelas: {
          select: {
            id: true,
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
