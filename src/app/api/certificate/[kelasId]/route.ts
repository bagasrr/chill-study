import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { kelasId: string } }) {
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;
  const { kelasId } = params;
  try {
    const certificates = await prisma.certificate.findMany({
      where: { kelasId, userId },
      include: {
        kelas: {
          select: {
            title: true,
            CompanyCode: true,
          },
        },
        official: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(certificates);
  } catch (err) {
    console.error("❌ Error fetch sertifikat:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
