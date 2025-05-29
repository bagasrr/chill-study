import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { kelasId: string; userId: string } }) {
  const { kelasId, userId } = params;
  try {
    const certificates = await prisma.certificate.findMany({
      where: { kelasId, userId },
    });
    return NextResponse.json(certificates);
  } catch (err) {
    console.error("❌ Error fetch sertifikat:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
