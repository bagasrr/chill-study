import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const latest = await prisma.official.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latest) {
      return NextResponse.json({ message: "No official found" }, { status: 404 });
    }

    return NextResponse.json({
      name: latest.name,
      position: latest.position,
      signatureUrl: latest.signatureUrl,
    });
  } catch (error) {
    console.error("❌ Failed to fetch latest official:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
