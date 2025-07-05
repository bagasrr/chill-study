import { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { kelasId: string } }) {
  const session = await getServerSession(authOptions);

  const { kelasId } = params;

  if (!session?.user || !kelasId) {
    return new Response("Unauthorized or missing kelasId", { status: 401 });
  }

  const certificate = await prisma.certificate.findFirst({
    where: { userId: session.user.id, kelasId },
    include: {
      kelas: {
        select: {
          title: true,
          CompanyCode: true,
          CertifTemplate: {
            select: {
              certifTemplate: true,
            },
          },
        },
      },
      official: {
        select: {
          name: true,
          signatureUrl: true,
          position: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  const user = certificate?.user;
  const kelas = certificate?.kelas;
  const latestOfficial = certificate?.official;

  const templateByClass = certificate?.kelas?.CertifTemplate?.certifTemplate;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape

  // Load template image
  // const templatePath = path.join(process.cwd(), "public", "SertifikatTemplate.png");
  const templateRecord = await prisma.certifTemplate.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!templateRecord || !templateRecord.certifTemplate) {
    return new Response("Certificate template not found in database", { status: 404 });
  }
  // const templateBytes = await readFile(templatePath?.certifTemplate as string);
  const templateUrl = templateByClass ? templateByClass : templateRecord.certifTemplate;
  const templateBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());
  const image = await pdfDoc.embedPng(templateBytes);
  const { width, height } = image.scale(0.5);

  // Draw image
  page.drawImage(image, { x: 0, y: 0, width, height });

  // Draw texts
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  page.drawText(user?.name as string, { x: 65, y: 315, size: 24, font, color: rgb(0, 0.2, 0.2) });
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

  page.drawText(latestOfficial?.name || "Unknown", { x: 65, y: 100, size: 14, font });
  page.drawText(latestOfficial?.position || "Pejabat", { x: 65, y: 80, size: 12, font });

  const pdfBytes = await pdfDoc.save();
  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=${certificate?.number}-${user?.name}.pdf`,
    },
  });
}
