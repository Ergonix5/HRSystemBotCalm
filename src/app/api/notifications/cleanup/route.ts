import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { cleanupExpiredNotifications } from "../../../service/notification.service";




// POST /api/notifications/cleanup - Clean up old/expired notifications
// This should be called by a cron job
// Query params:
// cronSecret (required for security)
// daysOld (optional, default: 90)
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

        const daysOld = Number(searchParams.get('daysOld') || 90);

        if (daysOld < 1 || daysOld > 365)
        {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid daysOld parameter. Must be between 1 and 365.'
                },
                { status: 400 }
            );
        }

        const result = await cleanupExpiredNotifications(daysOld);

        return NextResponse.json(
            {
                success: true,
                message: `Cleaned up ${result.deletedCount} old notifications`,
                deletedCount: result.deletedCount,
                daysOld,
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error('Error cleaning up notifications:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}
