import { z } from "zod";

export const createKelasSchema = z.object({
  title: z.string().min(1, "Title is required"),
  deskripsi: z.string().optional(),
  thumbnail: z.string().url().optional(),
  CompanyCode: z.string().min(1, "CompanyCode is required"),
});

export const updateKelasSchema = z.object({
  title: z.string().optional(),
  deskripsi: z.string().optional(),
  thumbnail: z.string().url().optional(),
  CompanyCode: z.string().min(1, "CompanyCode is required"),
});
