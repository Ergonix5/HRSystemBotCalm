import { connectDB } from "@/src/lib/db";
import { validateBody } from "@/src/lib/validate";
import { NotificationSchema, BulkNotificationSchema } from "@/src/validators/notification.schema";
import { Notification } from "../../models/notification.model";
import { NextResponse } from "next/server";
import { createNotification, createBulkNotifications } from "../../service/notification.service";
import { paginate } from "../../service/pagination.service";



// GET /api/notifications - Fetch paginated notifications for a user
// Query params:
// page, limit (pagination)
// recipientId (required - the employee viewing notifications)
// organizationId (required for multi-tenant)
// type (filter by notification type)
// read (filter by read status: 'true' or 'false')
// priority (filter by priority: 'low', 'medium', 'high')
export async function GET(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);

        // Extract pagination parameters
        const page = Math.max(1, Number(searchParams.get("page") ?? 1));
        const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));

        // Extract filter parameters
        const recipientId = searchParams.get("recipientId")?.trim();
        const organizationId = searchParams.get("organizationId")?.trim();
        const type = searchParams.get("type")?.trim();
        const readStatus = searchParams.get("read")?.trim();
        const priority = searchParams.get("priority")?.trim();

        // Validate required parameters
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

        // Build filter object
        const filter: Record<string, any> = {
            recipient: recipientId,
            organization: organizationId,
        };

        if (type && ['approval', 'rejection', 'reminder', 'system', 'announcement', 'alert'].includes(type))
        {
            filter.type = type;
        }

        if (readStatus === 'true')
        {
            filter.read = true;
        } else if (readStatus === 'false')
        {
            filter.read = false;
        }

        if (priority && ['low', 'medium', 'high'].includes(priority))
        {
            filter.priority = priority;
        }

        // Paginate notifications
        const result = await paginate(Notification, {
            page,
            limit,
            q: '', // No text search for notifications
            searchFields: [],
            sortBy: "created_at",
            sortOrder: -1, // Newest first
            filter,
        });

        // Get unread count
        const unreadCount = await Notification.countDocuments({
            recipient: recipientId,
            organization: organizationId,
            read: false,
        });

        return NextResponse.json(
            {
                ...result,
                unreadCount,
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}



// POST /api/notifications - Create a new notification
// Body: NotificationSchema or BulkNotificationSchema

export async function POST(req: Request)
{
    try
    {
        await connectDB();

        const body = await req.json();

        // Check if it's a bulk notification request
        if (body.recipientIds && Array.isArray(body.recipientIds))
        {
            // Bulk notification
            const result = await validateBody(
                { json: async () => body } as Request,
                BulkNotificationSchema
            );

            if (!result.ok) return result.res;

            const data = result.data;

            const bulkResult = await createBulkNotifications({
                organizationId: data.organizationId,
                recipientIds: data.recipientIds,
                type: data.type,
                title: data.title,
                message: data.message,
                metadata: data.metadata,
                priority: data.priority,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
                sendEmail: data.sendEmail,
            });

            return NextResponse.json(
                {
                    success: true,
                    message: `${bulkResult.count} notifications created successfully`,
                    count: bulkResult.count,
                },
                { status: 201 }
            );
        } else
        {
            // Single notification
            const result = await validateBody(
                { json: async () => body } as Request,
                NotificationSchema
            );

            if (!result.ok) return result.res;

            const data = result.data;

            const notificationResult = await createNotification({
                organizationId: data.organizationId,
                recipientId: data.recipientId,
                type: data.type,
                title: data.title,
                message: data.message,
                metadata: data.metadata,
                priority: data.priority,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
                sendEmail: data.sendEmail,
            });

            return NextResponse.json(
                {
                    success: true,
                    message: 'Notification created successfully',
                    data: notificationResult.notification,
                },
                { status: 201 }
            );
        }
    } catch (error)
    {
        console.error('Error creating notification:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/notifications - Mark all notifications as read for a user
// Body: { recipientId, organizationId }

export async function PATCH(req: Request)
{
    try
    {
        await connectDB();

        const body = await req.json();
        const { recipientId, organizationId } = body;

        if (!recipientId || !organizationId)
        {
            return NextResponse.json(
                { message: "recipientId and organizationId are required" },
                { status: 400 }
            );
        }

        const result = await Notification.updateMany(
            {
                recipient: recipientId,
                organization: organizationId,
                read: false,
            },
            {
                read: true,
                readAt: new Date(),
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: `${result.modifiedCount} notifications marked as read`,
                modifiedCount: result.modifiedCount,
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error('Error marking notifications as read:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
