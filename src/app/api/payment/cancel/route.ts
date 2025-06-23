// api/payment/cancel/route.ts (untuk App Router)
// atau pages/api/payment/cancel.ts (untuk Pages Router)

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json(); // Menerima orderId dari frontend
  const userId = session.user.id; // UserId dari sesi

  if (!orderId) {
    return NextResponse.json({ message: "Order ID is required." }, { status: 400 });
  }

  try {
    // Cari dan update transaksi spesifik yang pending/cart milik user ini
    const updatedPayment = await prisma.payment.updateMany({
      // Gunakan updateMany karena update tidak menerima AND di where
      where: {
        userId: userId,
        orderId: orderId, // Pastikan update hanya untuk orderId ini
        status: { in: ["PENDING", "CART"] }, // Hanya update jika statusnya masih pending/cart
      },
      data: { status: "CANCELLED" },
    });

    if (updatedPayment.count === 0) {
      // Jika tidak ada record yang diupdate (mungkin sudah PAID atau FAILED atau orderId salah)
      return NextResponse.json({ message: "Payment not found or not in PENDING/CART status." }, { status: 404 });
    }

    return NextResponse.json({ message: "Payment cancelled successfully." });
  } catch (error) {
    console.error("❌ Error cancelling payment:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
