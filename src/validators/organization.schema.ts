import { z } from "zod";


export const organizationCreateSchema = z.object({
  organization_id: z.string().min(3, "Organization ID must be at least 3 characters"),
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});