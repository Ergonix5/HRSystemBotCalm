import { z } from "zod";

export const candidateCreateSchema = z.object({
  candidate_id: z.string().min(3),

  first_name: z.string().min(2),
  last_name: z.string().min(2),

  email: z.string().email(),

  phone: z.string().min(8),

  current_position: z.string().min(2).optional(),

  experience_years: z.number().min(0).optional(),

  skills: z.array(z.string().min(1)).optional(),

  source: z
    .enum([
      "LinkedIn",
      "Indeed",
      "Referral",
      "Company Website",
      "Email",
      "Other",
    ])
    .optional()
    .default("Other"),

  status: z
    .enum([
      "Applied",
      "Screening",
      "Interview",
      "Technical Test",
      "Offer",
      "Hired",
      "Rejected",
      "On Hold",
    ])
    .optional()
    .default("Applied"),

  notes: z.string().optional(),

  cv_file: z
    .object({
      file_name: z.string().min(1, "File name is required"),
      file_url: z.string().url("Invalid file URL"),
      file_type: z.enum(["application/pdf"], {
        error: "Only PDF files are allowed",
      }),
      file_size: z
        .number()
        .max(5 * 1024 * 1024, "File size must be less than 5MB"),
      uploaded_at: z.coerce.date().optional(),
    })
    .optional(),
});
