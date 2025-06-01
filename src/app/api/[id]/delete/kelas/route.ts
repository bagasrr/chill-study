// contoh untuk /api/[id]/delete/kelas/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const user = session?.user.email;
  try {
    await prisma.kelas.update({
      where: { id },
      data: { IsDeleted: new Date(), LastUpdateDate: new Date(), LastUpdatedBy: user || "system" },
    });

    return NextResponse.json({ message: "Kelas berhasil di-soft delete" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal soft delete kelas" }, { status: 500 });
  }
}
