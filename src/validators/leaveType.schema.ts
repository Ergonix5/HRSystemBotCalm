




import { z } from "zod";

export const leaveTypeCreateSchema = z.object({
    organization: z.string().min(1, "Organization is required"),
    leave_type_id: z.string().min(3, "Leave Type ID is required"),
    name: z.string().min(2, "Leave Type Name is required"),
    description: z.string().optional(),
    anual_allocation: z.number().min(0, "Anual allocation must be at least 0"),
})