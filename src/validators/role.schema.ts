import { z } from "zod";

export const roleCreateSchema = z.object({
  organization: z.string().min(1), // Required MongoDB ObjectId
  role_id: z.string().min(3),
  role_name: z.string().min(2),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});
