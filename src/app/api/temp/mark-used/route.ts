import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { path } = body;

  await prisma.temporaryUpload.updateMany({
    where: { path },
    data: { isUsed: true },
  });

  return NextResponse.json({ message: "Ditandai sebagai digunakan" });
}
