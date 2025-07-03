// contoh untuk /api/[id]/delete/materi/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  try {
    await prisma.materi.update({
      where: { id },
      data: { IsDeleted: new Date(), LastUpdateDate: new Date(), LastUpdatedBy: session?.user.email || "system" },
    });

    return NextResponse.json({ message: "materi berhasil di-soft delete" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal soft delete materi" }, { status: 500 });
  }
}
