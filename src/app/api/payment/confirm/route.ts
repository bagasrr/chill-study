import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { orderId, materiId, price } = await req.json(); // ⬅️ menerima data dari frontend
  const userId = session.user.id;
  // ✅ CEK jika ada transaksi aktif
  const existing = await prisma.payment.findFirst({
    where: {
      userId,
      status: { in: ["CART", "PENDING"] },
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Kamu masih punya pembayaran yang belum selesai." }, { status: 400 });
  }

  try {
    // Create payment
    const payment = await prisma.payment.create({
      data: {
        userId,
        status: "PAID",
        orderId,
        CreatedBy: session.user.email || "system",
        items: {
          create: [
            {
              materiId,
              price,
              CreatedBy: session.user.email || "system",
            },
          ],
        },
      },
    });

    // Tambahkan ke kelasUser jika user belum punya kelasnya
    const materi = await prisma.materi.findUnique({
      where: { id: materiId },
      select: { kelasId: true },
    });

    if (materi) {
      const existingKelasUser = await prisma.kelasUser.findUnique({
        where: {
          userId_kelasId: {
            userId,
            kelasId: materi.kelasId,
          },
        },
      });

      if (!existingKelasUser) {
        await prisma.kelasUser.create({
          data: {
            userId,
            kelasId: materi.kelasId,
            CreatedBy: session.user.email || "system",
          },
        });
      }
    }

    return NextResponse.json({ message: "Payment saved" });
  } catch (error) {
    console.error("❌ Failed to save payment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
