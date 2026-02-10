import { connectDB } from "@/src/lib/db";
import { validateBody } from "@/src/lib/validate";
import { LeaveRequestSchema } from "@/src/validators/leaveRequest.schema";
import { Employee } from "../../models/employee.model";
import { NextRequest, NextResponse } from "next/server";
import { LeaveType } from "../../models/leaveType.model";
import { calcTotalDays, ensureValidLeaveDates } from "../../service/leaveRequest.service";
import { LeaveRequest } from "../../models/leaveRequest.model";
import { LeaveBalance } from "../../models/leaveBalance.model";
import { paginate } from "../../service/pagination.service";
import { checkLeaveBalance } from "../../service/leaveBalance.service";
import { createNotification, NotificationTemplates } from "../../service/notification.service";
import { logAction } from "@/src/lib/logger";
import { requirePermission } from "@/src/lib/permissions";




// POST: api/LeaveRequests
export async function POST(req: Request)
{
    // Check permission: LEAVE_CREATE
    const permCheck = await requirePermission("leave.create");

    if (!permCheck.authorized) {
      return permCheck.error!;
    }

    const user = permCheck.user!;

    try
    {
        await connectDB();

        const result = await validateBody(req, LeaveRequestSchema);
        if (!result.ok) return result.res;

        const data = result.data;

        // Security check: Ensure user can only create leave for themselves
        // unless they have admin permissions
        if (data.employee !== user.id && !user.permissions.includes("leave.view_all")) {
          return NextResponse.json(
            { message: "You can only create leave requests for yourself" },
            { status: 403 }
          );
        }

        // Ensure organization matches user's organization
        if (data.organization !== user.organization_id) {
          return NextResponse.json(
            { message: "Invalid organization" },
            { status: 403 }
          );
        }

        // Varify employee exists and belongs to the organization
        const employee = await Employee.findOne({
            _id: data.employee,
            organization: data.organization
        });

        if (!employee) {
            return NextResponse.json(
                { message: "Employee not found in the organization" },
                { status: 400 }
            );
        }

        // Varify leave type exsists for the organization
        const leaveType = await LeaveType.findOne({
            _id: data.leave_type,
            organization: data.organization
        });

        if (!leaveType) {
            return NextResponse.json(
                { message: "Leave Type not found in the organization" },
                { status: 400 }
            );
        }

        // Validate leave dates
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        ensureValidLeaveDates(start, end);

        const total_days = calcTotalDays(start, end);

        // Check overlapping leave requests for the employee
        const overlapping = await LeaveRequest.findOne({
            employee: data.employee,
            status: { $in: ["pending", "approved"] },
            $or: [
                { start_date: { $lte: start }, end_date: { $gte: start } },
                { start_date: { $lte: end }, end_date: { $gte: end } },
                { start_date: { $gte: start }, end_date: { $lte: end } }
            ]
        });

        if (overlapping) {
            return NextResponse.json(
                {
                    message: "Leave Request overlaps with an existing request",
                    overlapping: {
                        start_date: overlapping.start_date,
                        end_date: overlapping.end_date,
                        status: overlapping.status
                    }
                },
                { status: 400 }
            );
        }

        // Check leave balance

        const balanceCheck = await checkLeaveBalance(
            data.employee,
            data.leave_type,
            total_days
        );

        if (!balanceCheck.sufficient) {
            return NextResponse.json(
                {
                    message: balanceCheck.message,
                    ...balanceCheck.remainingDays
                },
                { status: balanceCheck.remainingDays ? 400 : 500 }
            )
        }



        // const currentYear = new Date().getFullYear();
        // const leaveBalance = await LeaveBalance.findOne({
        //     employee: data.employee,
        //     leave_type: data.leave_type,
        //     year: currentYear
        // });

        // if (!leaveBalance)
        // {
        //     return NextResponse.json(
        //         {
        //             message: "Leave balance not found for this employee and leave type",
        //             details: "Please contact HR to set up your leave balance"
        //         },
        //         { status: 400 }
        //     );
        // }

        // if (leaveBalance.remaining_days < total_days)
        // {
        //     return NextResponse.json(
        //         {
        //             message: "Insufficient leave balance",
        //             required: total_days,
        //             available: leaveBalance.remaining_days,
        //             allocated: leaveBalance.allocated_days,
        //             used: leaveBalance.used_days
        //         },
        //         { status: 400 }
        //     );
        // }

        // Create leave request
        const leaveRequest = await LeaveRequest.create({
            organization: data.organization,
            employee: data.employee,
            leave_type: data.leave_type,
            start_date: start,
            end_date: end,
            total_days: total_days,
            reason: data.reason || "",
            status: "pending"
        });

        // Populate references for response
        const populatedLeaveRequest = await LeaveRequest.findById(leaveRequest._id)
            .populate("employee", "first_name last_name email employee_id")
            .populate("leave_type", "leave_type_id name description")
            .populate("organization", "name")

        // Send notification to HR/Manager about new leave request
        try {
            const employeeData = populatedLeaveRequest.employee as any;
            const leaveTypeData = populatedLeaveRequest.leave_type as any;

            const template = NotificationTemplates.leaveRequestSubmitted(
                `${employeeData.first_name} ${employeeData.last_name}`,
                leaveTypeData.name,
                start.toLocaleDateString(),
                end.toLocaleDateString()
            );

            // Get all HR/Manager employees in the organization
            // For now, we'll send to all employees with 'HR' or 'Manager' role
            // You can customize this based on your role structure
            const hrManagers = await Employee.find({
                organization: data.organization,
                // Add role filter here based on your role structure
                // For example: role: { $in: ['HR', 'Manager'] }
            }).select('_id');

            // Send notification to each HR/Manager
            for (const hrManager of hrManagers) {
                await createNotification({
                    organizationId: data.organization,
                    recipientId: hrManager._id.toString(),
                    type: template.type,
                    title: template.title,
                    message: template.message,
                    priority: template.priority,
                    metadata: {
                        leaveRequestId: leaveRequest._id.toString(),
                        employeeId: data.employee,
                        actionUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/LeaveManagement`
                    },
                    sendEmail: true,
                });
            }
        } catch (notificationError) {
            // Log error but don't fail the request
            console.error('Failed to send leave request notification:', notificationError);
        }

        await logAction("LEAVE_REQUEST_CREATE", {
            leaveRequestId: leaveRequest._id,
            employeeId: data.employee,
            leaveTypeId: data.leave_type,
            startDate: start,
            endDate: end
        });

        return NextResponse.json(
            {
                success: true,
                message: "Leave request created successfully",
                data: populatedLeaveRequest
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error creating leave request:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}


//  GET /api/LeaveRequests - Fetch paginated leave requests with filtering
//  Query params: 
//  page, limit, q (search)
//  organizationId (required for multi-tenant)
//  employeeId (filter by specific employee)
//  status (filter by status: pending, approved, rejected, cancelled)
//  startDate, endDate (filter by date range)

export async function GET(req: Request)
{

    // Check permissions
    const permCheck = await requirePermission(undefined, [
        "leave.view",
        "leave.view_all",
        "leave.view_team"
    ]);
    
    if (!permCheck.authorized) return permCheck.error!;
    
    const user = permCheck.user!;

    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);

        // Extract pagination parameters
        const page = Math.max(1, Number(searchParams.get("page") ?? 1));
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10)));
        const q = (searchParams.get("q") ?? "").trim();

        // Extract filter parameters
        const organizationId = searchParams.get("organizationId")?.trim();
        const employeeId = searchParams.get("employeeId")?.trim();
        const status = searchParams.get("status")?.trim();
        const startDate = searchParams.get("startDate")?.trim();
        const endDate = searchParams.get("endDate")?.trim();

        // Build filter object with role-based access
        const filter: Record<string, any> = {};

        // Apply role-based data filtering
        if (user.permissions.includes("leave.view_all")) {
            // HR/Admin: Can view all leave requests in organization
            if (organizationId) filter.organization = organizationId;
        } else if (user.permissions.includes("leave.view_team")) {
            // Manager: Can view team members' requests
            // TODO: Add manager hierarchy check
            // For now, show all in organization (implement team filtering later)
            if (organizationId) filter.organization = organizationId;
        } else if (user.permissions.includes("leave.view")) {
            // Employee: Can only view own requests
            filter.employee = user.id;
            if (organizationId) filter.organization = organizationId;
        }

        if (employeeId) filter.employee = employeeId;

        if (status && ["pending", "approved", "rejected", "cancelled"].includes(status)) {
            filter.status = status;
        }

        if (startDate || endDate) {
            filter.$and = filter.$and || [];

            if (startDate) {
                filter.$and.push({
                    end_date: { $gte: new Date(startDate) }
                });
            }

            if (endDate) {
                filter.$and.push({
                    start_date: { $lte: new Date(endDate) }
                });
            }
        }

        // Paginate leave requests result
        const result = await paginate(LeaveRequest, {
            page,
            limit,
            q,
            searchFields: ["reason"],
            sortBy: "createdAt",
            sortOrder: -1,
            filter
        });

        // Populate references for each leave request
        const populatedData = await LeaveRequest.find({
            _id: { $in: result.data.map((item: any) => item._id) }
        })
            .populate('employee', 'first_name last_name email employee_id')
            .populate('leave_type', 'leave_type_id name description')
            .populate('organization', 'name')
            .sort({ createdAt: -1 })
            .lean();

        result.data = populatedData;

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error('Error fetching leave requests:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}