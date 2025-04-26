import { z } from "zod";

export const createKelasSchema = z.object({
  title: z.string().min(1, "Title is required"),
  deskripsi: z.string().optional(),
  thumbnail: z.string().url().optional(),
});

export const createMateriSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  price: z.number().int().min(0),
  kelasId: z.string().min(1, "kelasId is required"),
});
