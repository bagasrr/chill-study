import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { path } = body;
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;

  if (!userId || !path) {
    return NextResponse.json({ message: "Data kurang" }, { status: 400 });
  }

  await prisma.temporaryUpload.create({
    data: { userId, path },
  });

  return NextResponse.json({ message: "Berhasil disimpan sementara" });
}
