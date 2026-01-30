import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { getNotificationStats } from "../../../service/notification.service";

/**
 * GET /api/notifications/stats - Get notification statistics for a user
 * Query params:
 *   - recipientId (required)
 *   - organizationId (required)
 */
export async function GET(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const recipientId = searchParams.get("recipientId")?.trim();
        const organizationId = searchParams.get("organizationId")?.trim();

        if (!recipientId)
        {
            return NextResponse.json(
                { message: "recipientId is required" },
                { status: 400 }
            );
        }

        if (!organizationId)
        {
            return NextResponse.json(
                { message: "organizationId is required" },
                { status: 400 }
            );
        }

        const stats = await getNotificationStats(recipientId, organizationId);

        return NextResponse.json(
            {
                success: true,
                data: stats,
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error('Error fetching notification stats:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
