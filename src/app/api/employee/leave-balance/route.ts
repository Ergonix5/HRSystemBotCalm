import { connectDB } from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/src/lib/permissions";
import { getEmployeeLeaveBalances } from "@/src/app/service/leaveBalance.service";

/**
 * GET: /api/employee/leave-balance
 * Fetch leave balances for the authenticated employee
 * Query params:
 *   - year (optional): Year to fetch balances for (defaults to current year)
 *   - employeeId (optional): Employee ID (only for admins, defaults to authenticated user)
 */
export async function GET(req: NextRequest) {
    // Check permission
    const permCheck = await requirePermission("leave.view");

    if (!permCheck.authorized) {
        return permCheck.error!;
    }

    const user = permCheck.user!;

    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const year = searchParams.get("year") 
            ? parseInt(searchParams.get("year")!) 
            : new Date().getFullYear();
        
        let employeeId = searchParams.get("employeeId") || user.id;

        // Security check: Users can only view their own balances unless they have admin permissions
        if (employeeId !== user.id && !user.permissions.includes("leave.view_all")) {
            return NextResponse.json(
                { message: "You can only view your own leave balances" },
                { status: 403 }
            );
        }

        // Get leave balances
        const balances = await getEmployeeLeaveBalances(employeeId, year);

        if (!balances || balances.length === 0) {
            return NextResponse.json(
                { 
                    message: "No leave balances found. Please contact HR to set up your leave balance.",
                    balances: []
                },
                { status: 200 }
            );
        }

        // Format response
        const formattedBalances = balances.map((balance: any) => ({
            leaveTypeId: balance.leave_type_id._id,
            leaveTypeName: balance.leave_type_id.name,
            leaveTypeDescription: balance.leave_type_id.description,
            year: balance.year,
            allocatedDays: balance.allocated_days,
            usedDays: balance.used_days,
            remainingDays: balance.remaining_days
        }));

        return NextResponse.json({
            success: true,
            year,
            employeeId,
            balances: formattedBalances
        });

    } catch (error: any) {
        console.error("Error fetching leave balances:", error);
        return NextResponse.json(
            { 
                message: "Failed to fetch leave balances",
                error: error.message 
            },
            { status: 500 }
        );
    }
}
