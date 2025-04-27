// contoh untuk /api/[id]/delete/materi/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.materi.update({
      where: { id },
      data: { IsDeleted: new Date() },
    });

    return NextResponse.json({ message: "materi berhasil di-soft delete" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal soft delete materi" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const materi = await prisma.materi.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        deskripsi: true,
        thumbnail: true,
        CreatedBy: true,
        LastUpdatedBy: true,
        LastUpdateDate: true,
      },
    });
    return NextResponse.json(materi);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
