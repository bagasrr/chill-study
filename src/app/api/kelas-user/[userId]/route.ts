import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const kelasUser = await prisma.kelasUser.findMany({
      where: {
        userId,
        IsDeleted: null,
      },
      include: {
        kelas: true, // ✅ supaya dapat info detail kelas
      },
      orderBy: {
        LastUpdateDate: "asc",
      },
    });

    return NextResponse.json(kelasUser);
  } catch (error) {
    console.error("🔥 API /kelas-user error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
