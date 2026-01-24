
import { Types } from "mongoose";
import { LeaveBalance } from "../models/leaveBalance.model";
import { Employee } from "../models/employee.model";
import { LeaveType } from "../models/leaveType.model";
import { email, success } from "zod";




/**
 * Get leave balance for an employee and leave type
 */
export async function getLeaveBalance(
    employeeId: string | Types.ObjectId,
    leaveTypeId: string | Types.ObjectId,
    year: number = new Date().getFullYear()
)
{
    return await LeaveBalance.findOne({
        employee_id: employeeId,
        leave_type_id: leaveTypeId,
        year: year
    })
}

/**
 * Check if employee has sufficient leave balance
 */
export async function checkLeaveBalance(
    employeeId: string | Types.ObjectId,
    leaveTypeId: string | Types.ObjectId,
    requiredDays: number,
    year: number = new Date().getFullYear()
): Promise<{ sufficient: boolean; remainingDays?: any; message?: string }>
{
    const leaveBalance = await getLeaveBalance(employeeId, leaveTypeId, year);

    if (!leaveBalance)
    {
        return {
            sufficient: false,
            message: 'Leave balance not found for this employee and leave type. Please contact HR to set up your leave balance.'
        };
    }

    if (leaveBalance.remaining_days < requiredDays)
    {
        return {
            sufficient: false,
            remainingDays: {
                required: requiredDays,
                available: leaveBalance.remaining_days,
                allocated: leaveBalance.allocated_days,
                used: leaveBalance.used_days
            },
            message: 'Insufficient leave balance.'
        }
    }

    return {
        sufficient: true,
        remainingDays: leaveBalance
    }
}

/**
 * Deduct days from leave balance (when approving requests)
 */

export async function deductLeaveBalance(
    employeeId: string | Types.ObjectId,
    leaveTypeId: string | Types.ObjectId,
    days: number,
    year: number = new Date().getFullYear()
): Promise<{ success: boolean; remainingDays?: any; message?: string }>
{
    const leaveBalance = await getLeaveBalance(employeeId, leaveTypeId, year);

    if (!leaveBalance)
    {
        return {
            success: false,
            message: 'Leave balance not found for this employee and leave type. Please contact HR to set up your leave balance.'
        }
    }

    // Final check before deduction
    if (leaveBalance.remaining_days < days)
    {
        return {
            success: false,
            message: 'Insufficient leave balance for deduction.'
        }
    }

    // Deduct the days
    leaveBalance.used_days += days;
    leaveBalance.remaining_days = leaveBalance.allocated_days - leaveBalance.used_days;

    await leaveBalance.save();

    return {
        success: true,
        remainingDays: leaveBalance
    }
}

/**
 * Restore days to leave balance (when cancelling / rejecting approved requests)
 */
export async function restoreLeaveBalance(
    employeeId: string | Types.ObjectId,
    leaveTypeId: string | Types.ObjectId,
    days: number,
    year: number = new Date().getFullYear()
): Promise<{ success: boolean; remainingDays?: any; message?: string }>
{
    const leaveBalance = await getLeaveBalance(employeeId, leaveTypeId, year);

    if (!leaveBalance)
    {
        return {
            success: false,
            message: 'Leave balance not found.'
        }
    }

    // Restore the days (ensure used_days dosen't go below zero)
    leaveBalance.used_days = Math.max(0, leaveBalance.used_days - days);
    leaveBalance.remaining_days = leaveBalance.allocated_days - leaveBalance.used_days;

    await leaveBalance.save();

    return {
        success: true,
        remainingDays: leaveBalance
    }
}

/**
 * Get all leave balance for an employee
 */
export async function getEmployeeLeaveBalances(
    employeeId: string | Types.ObjectId,
    year: number = new Date().getFullYear()
)
{
    return await LeaveBalance.find({
        employee_id: employeeId,
        year: year
    }).populate('leave_type_id', 'leave_type_id name description');
}

/**
 * Initial leave balance setup for an employee and leave type
 * (usefull when onboarding new employee or adding new leave types)
 */
export async function initializeLeaveBalance(
    employeeId: string | Types.ObjectId,
    leaveTypeId: string | Types.ObjectId,
    allocatedDays: number,
    year: number = new Date().getFullYear()
)
{
    // Check if balance already exists
    const existing = await getLeaveBalance(employeeId, leaveTypeId, year);

    if (existing)
    {
        return {
            success: false,
            message: 'Leave balance already exists for this employee and leave type.',
            balance: existing
        }
    }

    // Create new leave balance
    const leaveBalance = await LeaveBalance.create({
        employee_id: employeeId,
        leave_type_id: leaveTypeId,
        year: year,
        allocated_days: allocatedDays,
        used_days: 0,
        remaining_days: allocatedDays
    })

    return {
        success: true,
        message: 'Leave balance initialized successfully.',
        balance: leaveBalance
    }
}

/**
 * Calculate total used days across all leave tyoes for an employee
 */
export async function getTotalUsedDays(
    employeeId: string | Types.ObjectId,
    year: number = new Date().getFullYear()
): Promise<number>
{
    const balance = await LeaveBalance.find({
        employee_id: employeeId,
        year: year
    })

    return balance.reduce((total, lb) => total + lb.used_days, 0);
}

/**
 * Reset policy options
 */
export interface ResetPolicy
{
    carryForward: boolean; // Whether to carry forward remaining days
    maxCarryFoward?: number; // Max days allowed to carry forward
    carryFowardExpiry?: number; // Months until carried forward days expire
}

/**
 * Reset leave balance for a new year for a specific employee and leave type
 */
export async function resetLeaveBalanceForEmployee(
    employeeId: string | Types.ObjectId,
    leaveTypeId: string | Types.ObjectId,
    newYear: number,
    policy: ResetPolicy = { carryForward: false }
): Promise<{ success: boolean; balance?: any; message?: string }>
{
    try
    {
        const previousYear = newYear - 1;

        // Get Leave TYpe to know the annual allocation
        const leaveType = await LeaveBalance.findById(leaveTypeId);
        if (!leaveType)
        {
            return {
                success: false,
                message: `Leave type not found: ${leaveTypeId}`
            }
        }

        // Get previous year's balance
        const previousBalance = await LeaveBalance.findOne({
            employee_id: employeeId,
            leave_type_id: leaveTypeId,
            year: previousYear
        });

        // Calculate carry foward days
        let carryFowardDays = 0;
        if (policy.carryForward && previousBalance)
        {
            carryFowardDays = previousBalance.remaining_days;

            // Apply maximum carry foward limit if specified
            if (policy.maxCarryFoward !== undefined)
            {
                carryFowardDays = Math.min(carryFowardDays, policy.maxCarryFoward);
            }
        }

        // Calculate new allocation
        const newAllocatedDays = leaveType.anual_allocation + carryFowardDays;

        // Check if balance already exists for new year
        const existingBalance = await LeaveBalance.findOne({
            employee_id: employeeId,
            leave_type_id: leaveTypeId,
            year: newYear
        });

        let newBalance;
        if (existingBalance)
        {
            // Update existing balance
            existingBalance.allocated_days = newAllocatedDays;
            existingBalance.remaining_days = newAllocatedDays - existingBalance.used_days;
            newBalance = await existingBalance.save();
        } else
        {
            // Create new blance for the year
            newBalance = await LeaveBalance.create({
                employee_id: employeeId,
                leave_type_id: leaveTypeId,
                year: newYear,
                allocated_days: newAllocatedDays,
                used_days: 0,
                remaining_days: newAllocatedDays
            })
        }

        return {
            success: true,
            balance: newBalance,
            message: `Balance reset successfully. Allocated days: ${newAllocatedDays}, Carry forward days: ${carryFowardDays}`
        }

    } catch (error: any)
    {
        return {
            success: false,
            message: error.message || 'Error resetting leave balance.'
        }
    }
}

/**
 * Reset leave balance for all employees in an organization
 */
export async function resetOrganizationLeaveBalances(
    organizationId: string | Types.ObjectId,
    newYear: number,
    policy: ResetPolicy = { carryForward: false}
): Promise<{
    success: boolean;
    totalProcessed: number;
    successful: number;
    failed: number;
    details: any[];
}>
{
    const results: any[] = [];
    let successful = 0;
    let failed = 0;

    try
    {
        // Get all employee in the organization
        const employees = await Employee.find({ organization: organizationId });

        // Get all leave types in the organization
        const leaveTypes = await LeaveType.find({ organization: organizationId });

        if (leaveTypes.length === 0)
        {
            return {
                success: false,
                totalProcessed: 0,
                successful: 0,
                failed: 0,
                details: [{ message: 'No leave types found for this organization.' }]
            };
        }

        // Reset balance for each employee and each leave type
        for (const employee of employees)
        {
            for (const leaveType of leaveTypes)
            {
                const result = await resetLeaveBalanceForEmployee(
                    employee._id,
                    leaveType._id,
                    newYear,
                    policy
                );

                if (result.success)
                {
                    successful++;
                } else
                {
                    failed++;
                }

                results.push({
                    employeeId: employee._id,
                    employeeName: `${employee.first_name} ${employee.last_name}`,
                    leaveTypeId: leaveType._id,
                    leaveTypeName: leaveType.name,
                    success: result.success,
                    message: result.message
                })
            };
        }

        return {
            success: true,
            totalProcessed: results.length,
            successful,
            failed,
            details: results
        }
    } catch (error: any)
    {
        return {
            success: false,
            totalProcessed: results.length,
            successful,
            failed,
            details: results
        }
    }
}

/**
 * Reset leave balances for all organizations (system-wide reset)
 */
export async function resetAllLeaveBalances(
    newYear: number,
    policy: ResetPolicy = { carryForward: false }
): Promise<{
    success: boolean;
    organizationProcessed: number;
    organizationLeaveTypes: number;
    totalEmployeeLeaveTypes: number;
    successful: number;
    failed: number;
    details: any[];
}>
{
    try
    {
        // Import organization model
        const { Organization } = await import('../models/organization.model');

        // Get all oraganization
        const organizations = await Organization.find({});

        let totalSuccessful = 0;
        let totalFailed = 0;
        let totalProcessed = 0;
        const orgDetails: any[] = [];

        for (const org of organizations)
        {
            const result = await resetOrganizationLeaveBalances(
                org._id,
                newYear,
                policy
            );

            totalSuccessful += result.successful;
            totalFailed += result.failed;
            totalProcessed += result.totalProcessed;

            orgDetails.push({
                organizationId: org._id,
                organizationName: org.name,
                totalProcessed: result.totalProcessed,
                successful: result.successful,
                failed: result.failed
            });
        }

        return {
            success: true,
            organizationProcessed: organizations.length,
            organizationLeaveTypes: totalProcessed,
            totalEmployeeLeaveTypes: totalProcessed,
            successful: totalSuccessful,
            failed: totalFailed,
            details: orgDetails
        }

    } catch (error: any)
    {
        throw new Error(error.message || 'Error resetting all leave balances.');
    }
}


/**
 * Get reset preview
 */
export async function getResetPreview(
    organizationId: string | Types.ObjectId,
    newYear: number,
    policy: ResetPolicy = { carryForward: false }
): Promise<any[]>
{
    const previousYear = newYear - 1;
    const preview: any[] = [];

    // Get all employee in the organization
    const employees = await Employee.find({ organization: organizationId })
        .select('first_name last_name email employee_id');
    
    // Get all leave types in the organization
    const leaveTypes = await LeaveType.find({ organization: organizationId });

    for (const employee of employees)
    {
        for (const leaveType of leaveTypes)
        {
            // Get previous year balance
            const previousBalance = await LeaveBalance.findOne({
                employee_id: employee._id,
                leave_type_id: leaveType._id,
                year: previousYear
            });

            let carryFowardDays = 0;
            if (policy.carryForward && previousBalance)
            {
                carryFowardDays = previousBalance.remaining_days;
                if (policy.maxCarryFoward !== undefined)
                {
                    carryFowardDays = Math.min(carryFowardDays, policy.maxCarryFoward);
                }
            }

            const newAllocatedDays = leaveType.anual_allocation + carryFowardDays;

            preview.push({
                employee: {
                    id: employee._id,
                    name: `${employee.first_name} ${employee.last_name}`,
                    email: employee.email,
                }, 
                leaveType: {
                    id: leaveType._id,
                    name: leaveType.name
                },
                previousYear: {
                    year: previousYear,
                    allocated: previousBalance?.allocated_days || 0,
                    used: previousBalance?.used_days || 0,
                    remaining: previousBalance?.remaining_days || 0,
                },
                newYear: {
                    year: newYear,
                    baseAllocation: leaveType.anual_allocation,
                    carryFoward: carryFowardDays,
                    totalAllocated: newAllocatedDays,
                }
            })
        }
    }
    return preview;
}