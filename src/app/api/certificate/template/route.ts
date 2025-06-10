import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { certifTemplate, name } = body;
  try {
    const data = await prisma.certifTemplate.create({
      data: {
        name,
        certifTemplate,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET() {
  try {
    const data = await prisma.certifTemplate.findMany();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500 });
  }
}
