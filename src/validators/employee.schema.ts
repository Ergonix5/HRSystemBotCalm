import { z } from "zod";

export const employeeCreateSchema = z.object({
  organization: z
    .string()
    .min(1, "Organization is required"),

  designation: z
    .string()
    .min(1, "Designation is required"),

  role: z
    .string()
    .min(1, "Role is required"),

  employee_id: z
    .string()
    .min(1, "Employee ID is required"),

  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .optional(),

  date_of_birth: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), {
      message: "Invalid date_of_birth",
    }),

  join_date: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), {
      message: "Invalid join_date",
    }),

  employment_status: z
    .enum(["active", "inactive", "terminated", "resigned", "on_leave"])
    .optional(),

  address: z
    .string()
    .max(200)
    .optional(),
});
