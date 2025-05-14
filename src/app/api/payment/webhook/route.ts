import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

  const existing = await prisma.payment.findUnique({ where: { orderId: order_id } });

  if (!existing) {
    console.warn("🚫 Payment record not found for webhook:", order_id);
    return NextResponse.json({ message: "Payment not found" }, { status: 404 });
  }

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (signature_key !== expectedSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  try {
    const status = mapMidtransStatus(transaction_status, fraud_status);

    // Update status payment berdasarkan order_id
    await prisma.payment.update({
      where: { orderId: order_id },
      data: { status },
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
