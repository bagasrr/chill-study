// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  // Hapus deviceToken
  await prisma.user.update({
    where: { email: session.user.email },
    data: { deviceToken: null },
  });

  // Redirect ke signout (NextAuth)
  return NextResponse.redirect(new URL("/api/auth/signout", req.url));
}
