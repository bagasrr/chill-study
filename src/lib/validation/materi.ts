// src/lib/validation/materi.ts
import { z } from "zod";

const attachmentSchema = z.object({
  name: z.string(), // Ini akan berisi path dari Supabase
  link: z.string().url(),
});

export const createMateriSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  price: z.number().int().min(0),
  kelasId: z.string().min(1, "kelasId is required"),
  contents: z
    .array(
      z.object({
        type: z.enum(["VIDEO", "PDF"]),
        title: z.string().min(1, "Judul item tidak boleh kosong"),
        url: z.string(),
        weight: z.number().min(0).max(100),
      })
    )
    .min(1, "Harus ada minimal 1 item konten"),
});

export const updateMateriSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  price: z.number().optional(),
  kelasId: z.string().optional(),

  newAttachments: z.array(attachmentSchema).optional(),
  removedAttachmentIds: z.array(z.string()).optional(),

  removedContentIds: z.array(z.string()).optional(),
  contents: z
    .array(
      z.object({
        id: z.string().optional(), // Tambahkan ini! Item baru tidak punya ID, item lama punya.
        type: z.enum(["VIDEO", "PDF"]),
        title: z.string().min(1, "Judul item tidak boleh kosong"),
        url: z.string(), // Pastikan URL valid
        weight: z.number().min(0).max(100),
        removedContentsIds: z.array(z.string()).optional(),
      })
    )
    .min(1, "Harus ada minimal 1 item konten"),
});

export type UpdateMateriInput = z.infer<typeof updateMateriSchema>;

export const deleteMateriSchema = z.object({
  id: z.string().min(1, "id is required"),
});
