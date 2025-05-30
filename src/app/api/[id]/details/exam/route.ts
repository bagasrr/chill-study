import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          where: { isDeleted: false },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
