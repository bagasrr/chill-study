import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { materiId } = await req.json();
    const userId = session.user.id;

    if (!materiId) {
      return NextResponse.json({ message: "materiId required" }, { status: 400 });
    }

    const existing = await prisma.progress.findUnique({
      where: {
        userId_materiId: { userId, materiId },
      },
    });

    if (!existing) {
      return NextResponse.json({ message: "Progress not found" }, { status: 404 });
    }

    await prisma.progress.update({
      where: { id: existing.id },
      data: {
        status: true,
        LastUpdatedBy: session.user.email || "system",
        LastUpdateDate: new Date(),
      },
    });

    return NextResponse.json({ message: "Progress marked as completed." });
  } catch (error) {
    console.error("🔥 Error in /progress/complete:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
