// api/payment/confirm.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { orderId, materiId, price } = await req.json();
  const userId = session.user.id;

  // Optional: Cek jika ada transaksi aktif, hanya di sini atau di checkout.
  // Jika ingin lebih ketat, biarkan di sini. Jika lebih fleksibel, hapus.
  const existing = await prisma.payment.findFirst({
    where: {
      userId,
      status: { in: ["CART", "PENDING"] },
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Kamu masih punya pembayaran yang belum selesai. Silahkan selesaikan pembayaran sebelumnya.", existing }, { status: 400 });
  }

  try {
    // Create payment dengan status PENDING
    await prisma.payment.create({
      data: {
        userId,
        status: "PENDING", // <--- PERBAIKAN PENTING DI SINI
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

    // Hapus logika penambahan KelasUser dari sini!
    // Itu akan dilakukan di webhook setelah pembayaran sukses.

    return NextResponse.json({ message: "Payment initiated", orderId: orderId }); // Mengembalikan orderId
  } catch (error) {
    console.error("❌ Failed to initiate payment:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
