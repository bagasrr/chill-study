// src/lib/validation/materi.ts
import { z } from "zod";

const attachmentSchema = z.object({
  name: z.string(), // Ini akan berisi path dari Supabase
  link: z.string().url(),
});

export const createMateriSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  price: z.number().int().min(0),
  kelasId: z.string().min(1, "kelasId is required"),
  attachments: z
    .array(
      z.object({
        name: z.string().min(1, "Attachment name is required"),
        link: z.string().url().min(1, "Attachment link is required"),
      })
    )
    .optional(), // Dibuat optional jika materi boleh tidak punya attachment
});

export const updateMateriSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  price: z.number().optional(),
  kelasId: z.string().optional(),
  newAttachments: z.array(attachmentSchema).optional(),
  removedAttachmentIds: z.array(z.string()).optional(),
});

export const deleteMateriSchema = z.object({
  id: z.string().min(1, "id is required"),
});
