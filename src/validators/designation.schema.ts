import { z } from "zod";

export const designationCreateSchema = z.object({
  designation_id: z.string().min(3, "Designation ID must be at least 3 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});
