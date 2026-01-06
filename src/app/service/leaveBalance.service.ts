
import { Types } from "mongoose";
import { LeaveBalance } from "../models/leaveBalance.model";
import { success } from "zod";
import { useDebugValue } from "react";




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
) {
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