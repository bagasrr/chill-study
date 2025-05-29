import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = getServerSession(authOptions);
  const userId = session?.user?.id;
  try {
    const userCertificate = await prisma.certificate.findFirst({
      where: {
        userId,
      },
      include: {
        kelas: {
          select: {
            title: true,
            CompanyCode: true,
          },
        },
        official: {
          select: {
            name: true,
            position: true,
          },
        },
      },
    });
    return NextResponse.json(userCertificate, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
