import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kelasNoExam = await prisma.kelas.findMany({
      where: {
        IsDeleted: null,
        exam: {
          none: {},
        },
      },
      select: {
        id: true,
        title: true,
        CompanyCode: true,
      },
    });

    return NextResponse.json(kelasNoExam);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
