import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const LeaveRequestSchema = z.object({
    organization: objectId,
    employee: objectId,
    leave_type: objectId,
    start_date: z.iso.datetime(),
    end_date: z.iso.datetime(),
    reason: z.string().max(500).optional(),
});

export const leaveRequestUpdateSchema = z.object({
    start_date: z.iso.datetime().optional(),
    end_date: z.iso.datetime().optional(),
    reason: z.string().max(500).optional(),
});

export const leaveRequestStatusSchema = z.object({
    status: z.enum(["Approved", "Rejected", "Cancelled"]),
    approver_employee_id: objectId
})