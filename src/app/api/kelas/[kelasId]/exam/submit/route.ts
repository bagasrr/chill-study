import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { kelasId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const { kelasId } = params;
  const userId = session.user.id;
  const { answers } = await req.json();

  const exam = await prisma.exam.findFirst({
    where: { kelasId },
    include: { questions: true },
  });

  if (!exam) return new Response("Exam not found", { status: 404 });

  let correct = 0;
  for (const question of exam.questions) {
    const userAnswer = answers.find((a: { questionId: string; answer: string }) => a.questionId === question.id);
    if (userAnswer?.answer === question.correctAnswer) correct++;
  }

  const score = Math.round((correct / exam.questions.length) * 100);
  const passed = correct >= exam.graduate;

  await prisma.examResult.create({
    data: { userId, examId: exam.id, score },
  });

  return Response.json({ score, correct, passed });
}
