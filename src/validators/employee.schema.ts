import { z } from "zod";

export const employeeCreateSchema = z.object({
  organization: z
    .string()
    .min(1, "Company ID is required"),

  designation: z
    .string()
    .min(1, "Designation ID is required"),

  role: z
    .string()
    .min(1, "Role ID is required"),

  employee_id: z
    .string()
    .min(1, "Employee ID is required"),

  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[0-9\s\-\(\)]{7,15}$/, "Invalid phone number format"),

  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional(),

  date_of_birth: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), {
      message: "Invalid date format",
    }),

  join_date: z
    .string()
    .optional()
    .refine((v) => !v || !isNaN(Date.parse(v)), {
      message: "Invalid date format",
    }),

  employment_status: z
    .enum(["Active", "Inactive"])
    .default("Active"),
});
