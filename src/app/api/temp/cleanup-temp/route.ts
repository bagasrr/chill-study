import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ⛔️ Validasi token cron job
  const token = req.headers.get("authorization");
  if (token !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const expired = await prisma.temporaryUpload.findMany({
    where: {
      isUsed: false,
      createdAt: {
        lt: thirtyMinutesAgo,
      },
    },
  });

  for (const file of expired) {
    await supabase.storage.from(file.bucket).remove([file.path]);
    await prisma.temporaryUpload.delete({ where: { id: file.id } });
  }

  return NextResponse.json({ deleted: expired.length });
}
