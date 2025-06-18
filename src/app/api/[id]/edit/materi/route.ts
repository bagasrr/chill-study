// app/api/[materiId]/edit/materi/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Jika Anda menggunakan NextAuth
import { authOptions } from "@/lib/auth"; // Sesuaikan path ke auth options Anda
import { z } from "zod";
import { UpdateMateriInput, updateMateriSchema } from "@/lib/validation/materi";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const materiId = params.id;

  if (!materiId) {
    return NextResponse.json({ message: "Materi ID is required" }, { status: 400 });
  }

  // Opsi: Autentikasi dan Otorisasi
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    // Contoh otorisasi: hanya admin
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 1. Validasi input menggunakan Zod
    const validatedData: UpdateMateriInput = updateMateriSchema.parse(body);

    const {
      title,
      content,
      price,
      kelasId,
      contents, // Ini adalah array gabungan dari frontend (baru & terupdate)
      removedContentIds,
      // newAttachments, // Opsional: jika Anda mengelola attachments
      // removedAttachmentIds, // Opsional: jika Anda mengelola attachments
    } = validatedData;

    // 2. Transaksi Prisma: Memastikan semua operasi berhasil atau tidak sama sekali
    const result = await prisma.$transaction(async (tx) => {
      // Update data dasar Materi
      const updatedMateri = await tx.materi.update({
        where: { id: materiId },
        data: {
          title: title,
          content: content,
          price: price,
          kelasId: kelasId,
          LastUpdateDate: new Date(),
          LastUpdatedBy: session.user?.email || "system",
        },
      });

      // 3. Tangani Konten Materi (MateriContent)
      // a. Hapus konten yang ditandai untuk dihapus
      if (removedContentIds && removedContentIds.length > 0) {
        await tx.materiContent.deleteMany({
          where: {
            id: {
              in: removedContentIds,
            },
            materiId: materiId, // Pastikan hanya menghapus konten dari materi ini
          },
        });
      }

      // b. Iterasi melalui 'contents' yang tersisa (sudah difilter di frontend)
      //    Tentukan apakah akan membuat baru atau mengupdate
      for (const item of contents) {
        if (item.id) {
          // Jika ada ID, berarti ini item yang sudah ada, lakukan update
          await tx.materiContent.update({
            where: { id: item.id },
            data: {
              type: item.type,
              title: item.title,
              url: item.url,
              weight: item.weight,
              // Anda bisa menambahkan LastUpdatedBy/Date jika ada di model MateriContent
            },
          });
        } else {
          // Jika tidak ada ID, berarti ini item baru, lakukan create
          await tx.materiContent.create({
            data: {
              materiId: materiId,
              type: item.type,
              title: item.title,
              url: item.url,
              weight: item.weight,
              createdBy: session.user?.email || "system",
            },
          });
        }
      }

      // 4. Tangani Attachments (Opsional: jika Anda mengelola attachments di sini)
      // Logika serupa dengan konten: deleteMany, createMany, update.

      return updatedMateri; // Kembalikan data materi yang telah diupdate
    });

    return NextResponse.json({ message: "Materi updated successfully", materi: result }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.errors);
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    console.error("Error updating materi:", error);
    return NextResponse.json({ message: "Failed to update materi", error: (error as Error).message }, { status: 500 });
  }
}
