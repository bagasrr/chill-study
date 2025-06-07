import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
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

    // Update exam
    await prisma.exam.update({
      where: { id },
      data: {
        kelasId,
        title,
        description,
        graduate,
        LastUpdatedBy: session.user.email,
        LastUpdateDate: new Date(),
      },
    });

    // Upsert each question
    const upsertPromises = questions.map((q) =>
      prisma.question.upsert({
        where: {
          id: q.id || "", // Jika kosong akan error, maka perlu pakai kondisi di bawah
        },
        update: {
          questionText: q.questionText,
          questionImage: q.questionImage,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          LastUpdateDate: new Date(),
          LastUpdatedBy: session.user.email,
        },
        create: {
          examId: id,
          questionText: q.questionText,
          questionImage: q.questionImage,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          LastUpdateDate: new Date(),
          LastUpdatedBy: session.user.email,
        },
      })
    );

    const currentQuestionIds = questions.filter((q) => q.id).map((q) => q.id);

    await prisma.question.updateMany({
      where: {
        examId: id,
        NOT: {
          id: { in: currentQuestionIds },
        },
      },
      data: {
        isDeleted: true,
      },
    });

    // Filter upsert hanya jika ada `q.id` atau create baru
    await Promise.all(
      questions.map((q) => {
        if (q.id) {
          return prisma.question.upsert({
            where: { id: q.id },
            update: {
              questionText: q.questionText,
              questionImage: q.questionImage,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
              LastUpdateDate: new Date(),
              LastUpdatedBy: session.user.email,
            },
            create: {
              examId: id,
              questionText: q.questionText,
              questionImage: q.questionImage,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
              LastUpdateDate: new Date(),
              LastUpdatedBy: session.user.email,
            },
          });
        } else {
          return prisma.question.create({
            data: {
              examId: id,
              questionText: q.questionText,
              questionImage: q.questionImage,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
              LastUpdateDate: new Date(),
              LastUpdatedBy: session.user.email,
            },
          });
        }
      })
    );

    return NextResponse.json({ message: "Exam updated with upserted questions" });
  } catch (err) {
    console.error("❌ Error upserting exam:", err);
    return NextResponse.json({ message: "Cant Update, Server error" }, { status: 500 });
  }
}
