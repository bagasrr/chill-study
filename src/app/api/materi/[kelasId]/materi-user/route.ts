import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { kelasId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { kelasId } = params;
  const userId = session.user.id;
  const userRole = session.user.role;

  try {
    const materi = await prisma.materi.findMany({
      where: { kelasId, IsDeleted: null },
      select: {
        id: true,
        title: true,
        price: true,
        content: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // ✅ Ambil semua payment PAID milik user untuk materi
    const paidItems = await prisma.paymentItem.findMany({
      where: {
        payment: {
          userId,
          status: "PAID",
        },
      },
      select: {
        materiId: true,
      },
    });

    // ✅ Ambil progress materi
    const progress = await prisma.progress.findMany({
      where: {
        userId,
        materiId: { in: materi.map((m) => m.id) },
      },
    });

    const paidMateriIds = new Set(paidItems.map((p) => p.materiId));
    const accessedMateriIds = new Set(progress.map((p) => p.materiId));

    const materiWithAccess = materi.map((m) => {
      const hasProgress = accessedMateriIds.has(m.id);
      const hasPaid = paidMateriIds.has(m.id);
      const canAccess = hasProgress || hasPaid || m.price === 0 || userRole === "ADMIN";

      return {
        ...m,
        canAccess,
        hasProgress,
      };
    });

    return NextResponse.json(materiWithAccess);
  } catch (err) {
    console.error("🔥 Error in materi-user:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
