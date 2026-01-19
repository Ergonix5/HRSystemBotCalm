import { z } from "zod";

export const roleCreateSchema = z.object({
  organization: z.string().min(1), // Required MongoDB ObjectId
  role_id: z.string().min(3),
  role_name: z.string().min(2),
  company_name: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
});
