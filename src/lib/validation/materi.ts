// src/lib/validation/materi.ts
import { z } from "zod";

export const createMateriSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  price: z.number().int().min(0),
  kelasId: z.string().min(1, "kelasId is required"),
});

export const updateMateriSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  price: z.number().optional(),
  kelasId: z.string().optional(),
});

export const deleteMateriSchema = z.object({
  id: z.string().min(1, "id is required"),
});
