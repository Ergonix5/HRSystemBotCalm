import { z } from "zod";

export const oraganiationCreateSchema = z.object({
  organization_id: z.string().min(3),
  name: z.string().min(2),
  description:z.string().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});