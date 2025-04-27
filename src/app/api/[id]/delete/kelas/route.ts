// contoh untuk /api/[id]/delete/kelas/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.kelas.update({
      where: { id },
      data: { IsDeleted: new Date() },
    });

    return NextResponse.json({ message: "Kelas berhasil di-soft delete" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal soft delete kelas" }, { status: 500 });
  }
}
