import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const exam = await prisma.exam.findMany({
      where: { isDeleted: false },
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
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error("❌ Error fetch sertifikat:", error);
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { kelasId, title, description, graduate, questions } = body;

    if (!kelasId || !title || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    if (typeof graduate !== "number" || graduate <= 0) {
      return NextResponse.json({ message: "graduate wajib diisi dan harus > 0" }, { status: 400 });
    }

    const exam = await prisma.exam.create({
      data: {
        kelasId,
        title,
        description,
        graduate,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            questionImage: q.questionImage,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
    });

    return NextResponse.json({ message: "Exam created", exam });
  } catch (err) {
    console.error("❌ Error create exam:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
