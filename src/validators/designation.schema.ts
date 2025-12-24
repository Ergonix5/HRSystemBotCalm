import { z } from "zod";

export const designationCreateSchema = z.object({
  designation_id: z.string().min(3),
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});
