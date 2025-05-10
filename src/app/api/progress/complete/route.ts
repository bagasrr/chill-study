import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { materiId } = await req.json();
  const userId = session.user.id;

  await prisma.progress.update({
    where: {
      userId_materiId: { userId, materiId },
    },
    data: {
      status: true,
      LastUpdatedBy: session.user.email || "system",
      LastUpdateDate: new Date(),
    },
  });

  return NextResponse.json({ message: "Progress marked as completed." });
}
