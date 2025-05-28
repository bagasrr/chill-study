import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { name, courseTitle, issuedDate, officialName } = await req.json();

  const templatePath = path.join(process.cwd(), "public", "certificate-template.png");
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);

  const templateImage = await pdfDoc.embedPng(templateBytes);
  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: 842,
    height: 595,
  });

  page.drawText(name, { x: 280, y: 300, size: 24 });
  page.drawText(courseTitle, { x: 240, y: 270, size: 18 });
  page.drawText(issuedDate, { x: 240, y: 240, size: 12 });
  page.drawText(officialName, { x: 580, y: 130, size: 12 });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=certificate-${name}.pdf`,
    },
  });
}
