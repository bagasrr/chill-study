import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validation/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const session = await getServerSession(authOptions);

    const validatedData = updateUserSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...validatedData, LastUpdatedBy: session?.user?.email || "system", LastUpdateDate: new Date() },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    // kalau error dari zod, tangkap khusus
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
