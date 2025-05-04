import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  deviceToken: z.string().optional(),
});
