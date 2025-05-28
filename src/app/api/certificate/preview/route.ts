import { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const kelasId = req.nextUrl.searchParams.get("kelasId");

  if (!session?.user || !kelasId) {
    return new Response("Unauthorized or missing kelasId", { status: 401 });
  }

  const user = session.user;
  const kelas = await prisma.kelas.findUnique({ where: { id: kelasId } });
  const latestOfficial = await prisma.official.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape

  // Load template image
  const templatePath = path.join(process.cwd(), "public", "SertifikatTemplate.png");
  const templateBytes = await readFile(templatePath);
  const image = await pdfDoc.embedPng(templateBytes);
  const { width, height } = image.scale(0.5);

  // Draw image
  page.drawImage(image, { x: 0, y: 0, width, height });

  // Draw texts
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(user.name, { x: 65, y: 315, size: 24, font, color: rgb(0, 0.2, 0.2) });
  page.drawText(kelas?.title || kelasId, { x: 65, y: 250, size: 18, font, color: rgb(0, 0.2, 0.2) });

  if (latestOfficial?.signatureUrl) {
    const signatureBytes = await fetch(latestOfficial?.signatureUrl).then((res) => res.arrayBuffer());
    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    page.drawImage(signatureImage, {
      x: 65, // sesuaikan posisi kanan bawah
      y: 110, // sesuaikan posisi bawah
      width: 100,
      height: 80,
    });
  }

  //   page.drawText(latestOfficial?.signatureUrl || "text", { x: 65, y: 100, width: 100, height: 100 });
  page.drawText(latestOfficial?.name || "Unknown", { x: 65, y: 100, size: 14, font });
  page.drawText(latestOfficial?.position || "Pejabat", { x: 65, y: 80, size: 12, font });

  const pdfBytes = await pdfDoc.save();
  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=sertifikat-preview.pdf",
    },
  });
}
