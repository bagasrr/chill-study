import { NextRequest, NextResponse } from "next/server";
import midtransClient from "midtrans-client";
// import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { kelasId, kelasName, price, userEmail, userName, orderId } = body;
  // ✅ CEK jika ada transaksi aktif
  // const existing = await prisma.payment.findFirst({
  //   where: {
  //     userId,
  //     status: { in: ["CART", "PENDING"] },
  //   },
  // });

  // // if (existing) {
  // //   return NextResponse.json({ message: "Kamu masih punya pembayaran yang belum selesai. boss", existing }, { status: 400 });
  // // }

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
  });

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: price,
    },
    item_details: [
      {
        id: kelasId,
        name: kelasName,
        price,
        quantity: 1,
      },
    ],
    customer_details: {
      first_name: userName,
      email: userEmail,
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (err) {
    console.error("❌ Midtrans error:", err);
    return NextResponse.json({ message: "Failed to create transaction" }, { status: 500 });
  }
}
