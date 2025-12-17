import { z } from "zod";

export const roleCreateSchema = z.object({
  role_id: z.string().min(3),
  role_name: z.string().min(2),
  description:z.string().optional(),    
  permissions: z.array(z.string()).optional(),

});