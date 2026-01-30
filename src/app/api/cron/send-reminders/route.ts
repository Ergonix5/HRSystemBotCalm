import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { Employee } from "../../../models/employee.model";
import { createBulkNotifications, NotificationTemplates } from "../../../service/notification.service";



// POST /api/cron/send-reminders - Send scheduled reminders to employees
//  This endpoint should be called by a cron job scheduler
//  Query params:
//  cronSecret (required for security)
//  type (optional: 'timesheet', 'leave_balance', 'upcoming_leave', 'probation', 'birthday', 'all')
//  organizationId (optional: send to specific organization only)
export async function POST(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);

        // Security: Verify cron secret
        const cronSecret = searchParams.get('cronSecret');
        const expectedSecret = process.env.CRON_SECRET || 'change-this-secret-in-production';

        if (cronSecret !== expectedSecret)
        {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unauthorized: Invalid cron secret.'
                },
                { status: 401 }
            );
        }

        const reminderType = searchParams.get('type') || 'all';
        const organizationId = searchParams.get('organizationId');

        const results = {
            timesheet: 0,
            leaveBalance: 0,
            upcomingLeave: 0,
            birthday: 0,
            probation: 0,
            total: 0,
        };

        // Build employee filter
        const employeeFilter: any = { employment_status: 'Active' };
        if (organizationId)
        {
            employeeFilter.organization = organizationId;
        }

        // Get all active employees
        const employees = await Employee.find(employeeFilter)
            .select('_id first_name last_name email organization date_of_birth join_date')
            .lean();

        if (employees.length === 0)
        {
            return NextResponse.json({
                success: true,
                message: 'No active employees found',
                results,
            });
        }

        // Send timesheet reminders (typically on Fridays)
        if (reminderType === 'timesheet' || reminderType === 'all')
        {
            const today = new Date().getDay();
            // 5 = Friday
            if (today === 5 || reminderType === 'timesheet')
            {
                const template = NotificationTemplates.timesheetReminder();

                // Group employees by organization
                const employeesByOrg = employees.reduce((acc, emp) =>
                {
                    const orgId = emp.organization.toString();
                    if (!acc[orgId]) acc[orgId] = [];
                    acc[orgId].push(emp._id.toString());
                    return acc;
                }, {} as Record<string, string[]>);

                // Send bulk notifications per organization
                for (const [orgId, empIds] of Object.entries(employeesByOrg))
                {
                    const employeeIds = empIds as string[];
                    await createBulkNotifications({
                        organizationId: orgId,
                        recipientIds: employeeIds,
                        type: template.type,
                        title: template.title,
                        message: template.message,
                        priority: template.priority,
                        metadata: {
                            actionUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/work-hours`
                        },
                        sendEmail: true,
                    });
                    results.timesheet += employeeIds.length;
                }
            }
        }

        // Send leave balance alerts (typically on 1st of each month)
        if (reminderType === 'leave_balance' || reminderType === 'all')
        {
            const today = new Date().getDate();
            // 1 = First day of month
            if (today === 1 || reminderType === 'leave_balance')
            {
                // Import LeaveBalance model
                const { LeaveBalance } = await import('../../../models/leaveBalance.model');
                const { LeaveType } = await import('../../../models/leaveType.model');

                const currentYear = new Date().getFullYear();

                // Get leave balances for all employees
                for (const employee of employees)
                {
                    const leaveBalances = await LeaveBalance.find({
                        employee_id: employee._id,
                        year: currentYear,
                    }).populate('leave_type_id', 'name');

                    for (const balance of leaveBalances)
                    {
                        const leaveType = balance.leave_type_id as any;
                        const template = NotificationTemplates.leaveBalanceAlert(
                            leaveType.name,
                            balance.remaining_days
                        );

                        await createBulkNotifications({
                            organizationId: employee.organization.toString(),
                            recipientIds: [employee._id.toString()],
                            type: template.type,
                            title: template.title,
                            message: template.message,
                            priority: template.priority,
                            metadata: {
                                leaveTypeId: leaveType._id.toString(),
                                remainingDays: balance.remaining_days,
                                actionUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/LeaveManagement`
                            },
                            sendEmail: false,
                        });
                        results.leaveBalance++;
                    }
                }
            }
        }

        // Send upcoming leave reminders (2 days before leave starts)
        if (reminderType === 'upcoming_leave' || reminderType === 'all')
        {
            const { LeaveRequest } = await import('../../../models/leaveRequest.model');

            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
            twoDaysFromNow.setHours(0, 0, 0, 0);

            const threeDaysFromNow = new Date(twoDaysFromNow);
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 1);

            // Find approved leave requests starting in 2 days
            const upcomingLeaves = await LeaveRequest.find({
                status: 'approved',
                start_date: {
                    $gte: twoDaysFromNow,
                    $lt: threeDaysFromNow,
                },
            })
                .populate('employee', '_id first_name last_name organization')
                .populate('leave_type', 'name')
                .lean();

            for (const leave of upcomingLeaves)
            {
                const employee = leave.employee as any;
                const leaveType = leave.leave_type as any;

                await createBulkNotifications({
                    organizationId: employee.organization.toString(),
                    recipientIds: [employee._id.toString()],
                    type: 'reminder',
                    title: 'Upcoming Leave Reminder 📅',
                    message: `Reminder: Your ${leaveType.name} starts in 2 days (${new Date(leave.start_date).toLocaleDateString()}).`,
                    priority: 'medium',
                    metadata: {
                        leaveRequestId: leave._id.toString(),
                        startDate: leave.start_date,
                        actionUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/LeaveManagement`
                    },
                    sendEmail: true,
                });
                results.upcomingLeave++;
            }
        }

        // Send probation period alerts (7 days before probation ends)
        if (reminderType === 'probation' || reminderType === 'all')
        {
            // Assuming standard 90-day probation period
            const PROBATION_DAYS = 90;
            const ALERT_DAYS_BEFORE = 7;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Calculate target date range (employees who joined 83 days ago)
            const targetJoinDate = new Date(today);
            targetJoinDate.setDate(targetJoinDate.getDate() - (PROBATION_DAYS - ALERT_DAYS_BEFORE));

            const nextDayAfterTarget = new Date(targetJoinDate);
            nextDayAfterTarget.setDate(nextDayAfterTarget.getDate() + 1);

            // Find employees whose probation ends in 7 days
            const probationEndingEmployees = employees.filter(emp =>
            {
                if (!emp.join_date) return false;
                const joinDate = new Date(emp.join_date);
                joinDate.setHours(0, 0, 0, 0);
                return joinDate >= targetJoinDate && joinDate < nextDayAfterTarget;
            });

            for (const employee of probationEndingEmployees)
            {
                const joinDate = new Date(employee.join_date);
                const probationEndDate = new Date(joinDate);
                probationEndDate.setDate(probationEndDate.getDate() + PROBATION_DAYS);

                // Get HR employees in the organization
                const hrEmployees = employees.filter(
                    emp => emp.organization.toString() === employee.organization.toString()
                    // Add role filter here if you have HR role: && emp.role === 'HR'
                );

                if (hrEmployees.length > 0)
                {
                    await createBulkNotifications({
                        organizationId: employee.organization.toString(),
                        recipientIds: hrEmployees.map(e => e._id.toString()),
                        type: 'alert',
                        title: '⏰ Probation Period Ending',
                        message: `${employee.first_name} ${employee.last_name}'s probation period ends on ${probationEndDate.toLocaleDateString()}. Please schedule performance review and confirmation.`,
                        priority: 'high',
                        metadata: {
                            employeeId: employee._id.toString(),
                            joinDate: employee.join_date,
                            probationEndDate: probationEndDate.toISOString(),
                            actionUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/employees`
                        },
                        sendEmail: true,
                    });
                    results.probation += hrEmployees.length;
                }
            }
        }

        // Send birthday notifications (daily check)
        if (reminderType === 'birthday' || reminderType === 'all')
        {
            const today = new Date();
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();

            // Find employees with birthdays today
            const birthdayEmployees = employees.filter(emp =>
            {
                if (!emp.date_of_birth) return false;
                const dob = new Date(emp.date_of_birth);
                return dob.getMonth() === todayMonth && dob.getDate() === todayDate;
            });

            for (const birthdayEmployee of birthdayEmployees)
            {
                // Send notification to all employees in the same organization
                const orgEmployees = employees.filter(
                    emp => emp.organization.toString() === birthdayEmployee.organization.toString()
                );

                await createBulkNotifications({
                    organizationId: birthdayEmployee.organization.toString(),
                    recipientIds: orgEmployees.map(e => e._id.toString()),
                    type: 'announcement',
                    title: '🎉 Birthday Celebration!',
                    message: `Today is ${birthdayEmployee.first_name} ${birthdayEmployee.last_name}'s birthday! Wish them a happy birthday! 🎂`,
                    priority: 'low',
                    metadata: {
                        birthdayEmployeeId: birthdayEmployee._id.toString(),
                    },
                    sendEmail: false,
                });
                results.birthday += orgEmployees.length;
            }
        }

        results.total = results.timesheet + results.leaveBalance + results.upcomingLeave + results.birthday + results.probation;

        return NextResponse.json({
            success: true,
            message: `Sent ${results.total} reminder notifications`,
            results,
            reminderType,
            employeesProcessed: employees.length,
        });

    } catch (error: any)
    {
        console.error('Error sending reminders:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal Server Error: ' + error.message
            },
            { status: 500 }
        );
    }
}
