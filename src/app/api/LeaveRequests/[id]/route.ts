import { Employee } from "@/src/app/models/employee.model";
import { LeaveBalance } from "@/src/app/models/leaveBalance.model";
import { LeaveRequest } from "@/src/app/models/leaveRequest.model";
import { deductLeaveBalance, restoreLeaveBalance } from "@/src/app/service/leaveBalance.service";
import { calcTotalDays, ensureValidLeaveDates } from "@/src/app/service/leaveRequest.service";
import { connectDB } from "@/src/lib/db";
import { validateBody } from "@/src/lib/validate";
import { leaveRequestStatusSchema, leaveRequestUpdateSchema } from "@/src/validators/leaveRequest.schema";
import { NextResponse } from "next/server";
import { success } from "zod";





type Params = { params: Promise<{ id: string }> };




/**
 * GET /api/LeaveRequests/[id] - Fetch single leave request by ID
 * Query params: organizationId (for multi-tenant)
 */

export async function GET(req: Request, { params }: Params)
{
    try
    {
        await connectDB();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get('organizationId')?.trim();

        const filter: any = { _id: id };
        if (organizationId)
        {
            filter.organization = organizationId;
        }

        const leaveRequest = await LeaveRequest.findOne(filter)
            .populate('employee', 'first_name last_name email employee_id')
            .populate('leave_type', 'leave_type_id name decription')
            .populate('organization', 'name');

        if (!leaveRequest)
        {
            return NextResponse.json(
                { message: "Leave request not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: leaveRequest
            },
            { status: 200 }
        );

    } catch (err: any)
    {
        console.error('Error fetching leave request:', err);
        return NextResponse.json(
            { message: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        )
    }

}

/**
 * PUT /api/LeaveRequests/[id] - Update leave request (only for pending status)
 * Body: { start_date?, end_date?, reason? }
 */
export async function PUT(req: Request, { params }: Params)
{
    try
    {
        await connectDB();

        const { id } = await params;

        // Find existing leave request
        const existingRequest = await LeaveRequest.findById(id);

        if (!existingRequest)
        {
            return NextResponse.json(
                { message: "Leave request not found" },
                { status: 404 }
            )
        }

        // Only pending requests can be updated
        if (existingRequest.status !== 'pending')
        {
            return NextResponse.json(
                {
                    message: "Only pending leave request can be updated",
                    details: `Only pending request can ne updated. Current status: ${existingRequest.status}`
                },
                { status: 400 }
            )
        }

        // Validate request body
        const result = await validateBody(req, leaveRequestUpdateSchema);
        if (!result.ok) return result.res;

        const data = result.data;

        // Prepare update data
        const updateData: any = {};

        // If dates are being updated, validate them
        if (data.start_date || data.end_date)
        {
            const start = data.start_date ? new Date(data.start_date) : existingRequest.start_date;
            const end = data.end_date ? new Date(data.end_date) : existingRequest.end_date;

            // Validate leave dates
            ensureValidLeaveDates(start, end);

            // Calculate new total days
            const total_days = calcTotalDays(start, end);

            // Check for overlapping leave requests
            const overlapping = await LeaveRequest.findOne({
                _id: { $ne: id },
                employee: existingRequest.employee,
                $or: [
                    { start_date: { $lte: start }, end_date: { $gte: start } },
                    { start_date: { $lte: end }, end_date: { $gte: end } },
                    { start_date: { $gte: start }, end_date: { $lte: end } }
                ]
            })

            if (overlapping)
            {
                return NextResponse.json(
                    {
                        message: 'Updated dates overlapping with another leave request',
                        overlapping: {
                            id: overlapping._id,
                            start_date: overlapping.start_date,
                            end_date: overlapping.end_date,
                            status: overlapping.status
                        }
                    },
                    { status: 400 }
                )
            }

            // Check leave alance for the updated total days
            const currentYear = new Date().getFullYear();
            const leaveBalance = await LeaveBalance.findOne({
                employee_id: existingRequest.employee,
                leave_type_id: existingRequest.leave_type,
                year: currentYear
            });

            if (!leaveBalance)
            {
                return NextResponse.json(
                    { message: "Leave balance not found for the employee and leave type" },
                    { status: 400 }
                )
            }

            if (leaveBalance.remaining_days < total_days)
            {
                return NextResponse.json(
                    {
                        message: 'Insufficient leave balance for the updated leave request',
                        required: total_days,
                        available: leaveBalance.remaining_days
                    },
                    { status: 400 }
                )
            }

            // Set updated dates and total days
            if (data.start_date) updateData.start_date = start;
            if (data.end_date) updateData.end_date = end;
            updateData.total_days = total_days;
        }

        // Update reason if provided
        if (data.reason !== undefined)
        {
            updateData.reason = data.reason;
        }

        // Update the leave request
        const updatedRequest = await LeaveRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
            .populate('employee', 'first_name last_name email employee_id')
            .populate('leave_type', 'leave_type_id name description')
            .populate('organization', 'name');

        return NextResponse.json({
            success: true,
            message: "Leave request updated successfully",
            data: updatedRequest
        })


    } catch (err: any)
    {
        console.error('Error updating leave request:', err);
        return NextResponse.json(
            { message: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        )
    }

}

/**
 * DELETE /api/LeaveRequests/[id] - Cancel leave request (soft delete)
 * Sets status to 'cancelled' instead of actually deleting
 */
export async function DELETE(req: Request, { params }: Params)
{
    try
    {
        await connectDB();

        const { id } = await params;

        // Find the leave request
        const leaveRequest = await LeaveRequest.findById(id);

        if (!leaveRequest)
        {
            return NextResponse.json(
                { message: 'Leave request not found' },
                { status: 404 }
            )
        }

        // Check if request can be cancelled
        if (leaveRequest.status !== 'cancelled')
        {
            return NextResponse.json(
                { message: 'Leave request already cancelled' },
                { status: 400 }
            )
        }

        // If approved, restore leave blance
        if (leaveRequest.status === 'approved')
        {
            const currentYear = new Date().getFullYear();
            await restoreLeaveBalance(
                leaveRequest.employee,
                leaveRequest.leave_type,
                leaveRequest.total_days,
                currentYear
            )

        }

        // Update status to cancelled (soft delete)
        leaveRequest.status = 'cancelled';
        await leaveRequest.save();

        const populatedRequest = await LeaveRequest.findById(id)
            .populate('employee', 'first_name last_name email employee_id')
            .populate('leave_type', 'leave_type_id name description');

        return NextResponse.json({
            success: true,
            message: "Leave request cancelled successfully",
            data: populatedRequest
        });
    } catch (err: any)
    {
        console.error('Error cancelling leave request:', err);
        return NextResponse.json(
            { message: err.message || 'Internal server error' },
            { status: 400 }
        );
    }
}


/**
 * PATCH /api/LeaveRequests/[id] - Update leave request status (approve/reject)
 * Body: { status: "Approved" | "Rejected" | "Cancelled", approver_employee_id: ObjectId }
 */
export async function PATCH(req: Request, { params }: Params)
{
    try
    {
        await connectDB();

        const { id } = await params;

        // Validate request body
        const result = await validateBody(req, leaveRequestStatusSchema);
        if (!result.ok) return result.res;

        const { status, approver_employee_id } = result.data;

        // Find exsisting leave request
        const leaveRequest = await LeaveRequest.findById(id);

        if (!leaveRequest)
        {
            return NextResponse.json(
                { message: 'Leave request not found' },
                { status: 404 }
            );
        }

        // Validate status transition - only pending request can be approved/rejected
        if (status !== 'Cancelled' && leaveRequest.status !== 'pending')
        {
            return NextResponse.json(
                {
                    message: 'Invalid status transition',
                    details: `Cannot change status from ${leaveRequest.status} to ${status}. Only pending request can be approved or rejected.`
                },
                { status: 400 }
            )
        }

        // Varify approver exists
        const approver = await Employee.findById(approver_employee_id);
        if (!approver)
        {
            return NextResponse.json(
                { message: 'Approver employee not founded' },
                { status: 400 }
            )
        }

        // Nomalize status to lowercase for cosistency with model
        const normalizedStatus = status.toLowerCase();

        // Handle leave balance updates base on status change

        if (normalizedStatus === 'approved')
        {
            // Deduct from leave blance when approved
            const currentYear = new Date().getFullYear();
            const deductionResult = await deductLeaveBalance(
                leaveRequest.employee,
                leaveRequest.leave_type,
                leaveRequest.total_days,
                currentYear
            );

            if (!deductionResult.success)
            {
                return NextResponse.json(
                    {
                        message: deductionResult.message,
                        ...deductionResult.remainingDays
                    },
                    { status: 400 }
                )
            }
            

        } else if (normalizedStatus === 'rejected' || normalizedStatus === 'cancelled')
        {
            // No balance changes needed for rejection or cancellation of pending requests
            // (Blance is only deducted on approval)
        }

        // Update leave request ststus
        leaveRequest.status = normalizedStatus;
        leaveRequest.approver = approver_employee_id;
        await leaveRequest.save();

        // Return populated response
        const updatedRequest = await LeaveRequest.findById(id)
            .populate('employee', 'first_name last_name email employee_id')
            .populate('leave_type', 'leave_type_id name description')
            .populate('organization', 'name');

        return NextResponse.json({
            success: true,
            message: `Leave request ${normalizedStatus} successfully`,
            data: updatedRequest
        });

    } catch (err: any)
    {
        console.error('Error updating leave request status:', err);
        return NextResponse.json(
            { message: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        )
    }

}