import { z } from "zod";

export const announcementCreateSchema = z.object({

  organization: z.string().min(1, "Organization is required"),
  
  annoucement_id: z.string().min(3, "Announcement ID must be at least 3 characters"),

  title: z.string().min(2, "Title must be at least 2 characters"),

  priority: z
    .enum(["High", "Medium", "Low"])
    .optional()
    .default("Low"),

  details_description: z.string().optional(),

  expire_date: z.string().optional(),

  status: z
    .enum(["active", "inactive"])
    .optional()
    .default("active"),
});

export const announcementUpdateSchema = z.object({

  organization: z.string().min(1, "Organization is required"),
  
  annoucement_id: z.string().min(3).optional(),

  title: z.string().min(2).optional(),

  priority: z
    .enum(["High", "Medium", "Low"])
    .optional(),

  details_description: z.string().optional(),

  expire_date: z.string().optional(),

  status: z
    .enum(["active", "inactive"])
    .optional(),
});

// Type inference for TypeScript
export type AnnouncementCreateInput = z.infer<typeof announcementCreateSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;