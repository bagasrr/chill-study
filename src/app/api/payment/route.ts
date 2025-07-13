import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const payement = await prisma.payment.findMany({
      //   where: { IsDeleted: null },
      //   select: {
      //     id: true,
      //     title: true,
      //     deskripsi: true,
      //     thumbnail: true,
      //     createdAt: true,
      //     CreatedBy: true,
      //     LastUpdatedBy: true,
      //     LastUpdateDate: true,
      //     CompanyCode: true,
      //     materi: {
      //       select: {
      //         id: true,
      //         title: true,
      //         price: true,
      //       },
      //     },
      //   },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(payement);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
