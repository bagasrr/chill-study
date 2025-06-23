// api/payment/webhook.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (signature_key !== expectedSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  try {
    const newStatus = mapMidtransStatus(transaction_status, fraud_status);

    // Ambil payment record
    const paymentRecord = await prisma.payment.findUnique({
      where: { orderId: order_id },
      include: {
        items: {
          // Include items untuk mendapatkan materiId
          select: { materiId: true },
        },
      },
    });

    if (!paymentRecord) {
      console.warn("🚫 Payment record not found for webhook:", order_id);
      return NextResponse.json({ message: "Payment not found" }, { status: 404 });
    }

    // Jika status berubah menjadi PAID, dan sebelumnya BUKAN PAID
    if (newStatus === "PAID" && paymentRecord.status !== "PAID") {
      // Lakukan penambahan user ke KelasUser di sini
      // Asumsi satu payment item per transaksi, atau ambil semua materiId
      for (const item of paymentRecord.items) {
        const materi = await prisma.materi.findUnique({
          where: { id: item.materiId },
          select: { kelasId: true },
        });

        if (materi) {
          const existingKelasUser = await prisma.kelasUser.findUnique({
            where: {
              userId_kelasId: {
                userId: paymentRecord.userId, // Menggunakan userId dari paymentRecord
                kelasId: materi.kelasId,
              },
            },
          });

          if (!existingKelasUser) {
            await prisma.kelasUser.create({
              data: {
                userId: paymentRecord.userId,
                kelasId: materi.kelasId,
                // CreatedBy: ambil dari paymentRecord jika ada, atau default
                CreatedBy: "webhook-system",
              },
            });
            console.log(`✅ User ${paymentRecord.userId} added to Kelas ${materi.kelasId} via webhook.`);
          } else {
            console.log(`ℹ️ User ${paymentRecord.userId} already in Kelas ${materi.kelasId}.`);
          }
        }
      }
    }
    // Update status payment di database lokal
    await prisma.payment.update({
      where: { orderId: order_id },
      data: { status: newStatus },
    });
    console.log("🔥 Webhook masuk", body.transaction_status, body.order_id);

    return NextResponse.json({ message: "OK" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

function mapMidtransStatus(transactionStatus: string, fraudStatus: string) {
  if (transactionStatus === "capture") {
    return fraudStatus === "accept" ? "PAID" : "PENDING";
  } else if (transactionStatus === "settlement") {
    return "PAID";
  } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
    return "FAILED";
  } else if (transactionStatus === "pending") {
    return "PENDING";
  }

  return "PENDING";
}
