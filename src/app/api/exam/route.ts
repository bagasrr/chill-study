import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const exam = await prisma.exam.findMany({
      include: {
        kelas: {
          select: {
            title: true,
            CompanyCode: true,
          },
        },
        questions: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error("❌ Error fetch sertifikat:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
