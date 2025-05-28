import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();

  const name = form.get("name") as string;
  const position = form.get("position") as string;
  const file = form.get("file") as File;

  if (!name || !position || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const fileName = `ttd-${Date.now()}-${file.name}`;
  const { data, error } = await supabaseServer.storage.from("ttd").upload(fileName, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseServer.storage.from("ttd").getPublicUrl(fileName);

  const official = await prisma.official.create({
    data: {
      name,
      position,
      signatureUrl: publicUrlData.publicUrl,
      isActive: true,
    },
  });

  return NextResponse.json(official);
}
