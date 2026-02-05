import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { NotificationPreferences } from "../../models/notificationPreferences.model";
import { Employee } from "../../models/employee.model";
import { validateBody } from "@/src/lib/validate";
import { z } from "zod";

// Validation schema for notification type preference
const NotificationTypePreferenceSchema = z.object({
    inApp: z.boolean(),
    email: z.boolean(),
});

// Validation schema for updating preferences
const UpdatePreferencesSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    organizationId: z.string().min(1, 'Organization ID is required'),
    preferences: z.object({
        leaveApproval: NotificationTypePreferenceSchema.optional(),
        leaveRejection: NotificationTypePreferenceSchema.optional(),
        leaveSubmission: NotificationTypePreferenceSchema.optional(),
        leaveCancellation: NotificationTypePreferenceSchema.optional(),
        timesheetReminder: NotificationTypePreferenceSchema.optional(),
        leaveBalanceAlert: NotificationTypePreferenceSchema.optional(),
        upcomingLeaveReminder: NotificationTypePreferenceSchema.optional(),
        probationEnding: NotificationTypePreferenceSchema.optional(),
        systemAnnouncement: NotificationTypePreferenceSchema.optional(),
        birthdayNotification: NotificationTypePreferenceSchema.optional(),
        welcomeMessage: NotificationTypePreferenceSchema.optional(),
        generalAlert: NotificationTypePreferenceSchema.optional(),
    }).optional(),
    globalSettings: z.object({
        allNotifications: z.boolean().optional(),
        allEmails: z.boolean().optional(),
        frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
        quietHours: z.object({
            enabled: z.boolean().optional(),
            startTime: z.string().optional(),
            endTime: z.string().optional(),
        }).optional(),
    }).optional(),
});


// GET /api/notification-preferences - Get user's notification preferences
// Query params: employeeId, organizationId

export async function GET(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get('employeeId');
        const organizationId = searchParams.get('organizationId');

        if (!employeeId || !organizationId)
        {
            return NextResponse.json(
                { message: 'Employee ID and Organization ID are required' },
                { status: 400 }
            );
        }

        // Verify employee exists
        const employee = await Employee.findOne({
            _id: employeeId,
            organization: organizationId,
        });

        if (!employee)
        {
            return NextResponse.json(
                { message: 'Employee not found in organization' },
                { status: 404 }
            );
        }

        // Get or create preferences
        const preferences = await (NotificationPreferences as any).getOrCreate(employeeId, organizationId);

        return NextResponse.json({
            success: true,
            data: preferences,
        });

    } catch (error: any)
    {
        console.error('Error fetching notification preferences:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}


// POST /api/notification-preferences - Create or update notification preferences
// Body: { employeeId, organizationId, preferences, globalSettings }

export async function POST(req: Request)
{
    try
    {
        await connectDB();

        const result = await validateBody(req, UpdatePreferencesSchema);
        if (!result.ok) return result.res;

        const data = result.data;

        // Verify employee exists
        const employee = await Employee.findOne({
            _id: data.employeeId,
            organization: data.organizationId,
        });

        if (!employee)
        {
            return NextResponse.json(
                { message: 'Employee not found in organization' },
                { status: 404 }
            );
        }

        // Find existing preferences or create new
        let preferences = await NotificationPreferences.findOne({
            employee: data.employeeId,
            organization: data.organizationId,
        });

        if (preferences)
        {
            // Update existing preferences
            if (data.preferences)
            {
                Object.keys(data.preferences).forEach(key =>
                {
                    const preferenceValue = data.preferences![key as keyof typeof data.preferences];
                    if (preferenceValue !== undefined)
                    {
                        preferences!.preferences[key] = preferenceValue;
                    }
                });
            }

            if (data.globalSettings)
            {
                Object.keys(data.globalSettings).forEach(key =>
                {
                    if (data.globalSettings![key as keyof typeof data.globalSettings] !== undefined)
                    {
                        if (key === 'quietHours' && data.globalSettings!.quietHours)
                        {
                            preferences!.globalSettings.quietHours = {
                                ...preferences!.globalSettings.quietHours,
                                ...data.globalSettings!.quietHours,
                            };
                        } else
                        {
                            preferences!.globalSettings[key] = data.globalSettings![key as keyof typeof data.globalSettings];
                        }
                    }
                });
            }

            preferences!.lastUpdated = new Date();
            await preferences!.save();
        } else
        {
            // Create new preferences
            preferences = await NotificationPreferences.create({
                employee: data.employeeId,
                organization: data.organizationId,
                preferences: data.preferences || {},
                globalSettings: data.globalSettings || {},
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Notification preferences updated successfully',
            data: preferences,
        });

    } catch (error: any)
    {
        console.error('Error updating notification preferences:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}


// PUT /api/notification-preferences - Update notification preferences (alias for POST)

export async function PUT(req: Request)
{
    return POST(req);
}


// DELETE /api/notification-preferences - Reset to default preferences
// Query params: employeeId, organizationId

export async function DELETE(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get('employeeId');
        const organizationId = searchParams.get('organizationId');

        if (!employeeId || !organizationId)
        {
            return NextResponse.json(
                { message: 'Employee ID and Organization ID are required' },
                { status: 400 }
            );
        }

        // Delete existing preferences
        await NotificationPreferences.findOneAndDelete({
            employee: employeeId,
            organization: organizationId,
        });

        // Create new default preferences
        const preferences = await (NotificationPreferences as any).createDefaultPreferences(
            employeeId,
            organizationId
        );

        return NextResponse.json({
            success: true,
            message: 'Notification preferences reset to defaults',
            data: preferences,
        });

    } catch (error: any)
    {
        console.error('Error resetting notification preferences:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
