import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateMateriSchema } from "@/lib/validation/materi";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // Inisialisasi Supabase Server Client
  const supabase = createServerComponentClient({ cookies });

  try {
    const id = params.id;
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { newAttachments, removedAttachmentIds, ...materiData } = updateMateriSchema.parse(body);

    // Langkah 1: Hapus file dari Supabase Storage jika ada
    if (removedAttachmentIds && removedAttachmentIds.length > 0) {
      // Dapatkan path file dari database berdasarkan ID yang akan dihapus
      const attachmentsToDelete = await prisma.attachment.findMany({
        where: {
          id: { in: removedAttachmentIds },
        },
      });

      const filePathsToDelete = attachmentsToDelete.map((att) => att.name);

      if (filePathsToDelete.length > 0) {
        const { error: storageError } = await supabase.storage.from("file").remove(filePathsToDelete);

        if (storageError) {
          console.error("Supabase storage error:", storageError);
          throw new Error("Gagal menghapus file dari storage.");
        }
      }
    }

    // Langkah 2: Lakukan update database dalam satu transaksi
    const updatedMateri = await prisma.materi.update({
      where: { id },
      data: {
        ...materiData,
        LastUpdatedBy: session?.user?.email || "system",
        LastUpdateDate: new Date(),
        // Gunakan nested writes untuk mengelola attachments
        attachments: {
          // Hapus record dari tabel Attachment
          deleteMany: removedAttachmentIds
            ? {
                id: { in: removedAttachmentIds },
              }
            : undefined,
          // Buat record baru untuk file yang baru diunggah
          create: newAttachments?.map((att) => ({
            name: att.name,
            link: att.link,
          })),
        },
      },
      include: {
        attachments: true, // Kirim kembali data attachments terbaru
      },
    });

    return NextResponse.json(updatedMateri);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      // Termasuk error dari Zod
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
