import { connectDB } from "@/src/lib/db";
import { Notification } from "../../../models/notification.model";
import { NextResponse } from "next/server";



// GET /api/notifications/[id] - Get a specific notification
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
)
{
    try
    {
        await connectDB();

        const { id } = params;
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get("organizationId");

        if (!organizationId)
        {
            return NextResponse.json(
                { message: "organizationId is required" },
                { status: 400 }
            );
        }

        const notification = await Notification.findOne({
            _id: id,
            organization: organizationId,
        });

        if (!notification)
        {
            return NextResponse.json(
                { message: "Notification not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: notification,
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error('Error fetching notification:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}



// PATCH /api/notifications/[id] - Mark a specific notification as read
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
)
{
    try
    {
        await connectDB();

        const { id } = params;
        const body = await req.json();
        const { organizationId, recipientId } = body;

        if (!organizationId || !recipientId)
        {
            return NextResponse.json(
                { message: "organizationId and recipientId are required" },
                { status: 400 }
            );
        }

        // Verify notification belongs to the user and organization
        const notification = await Notification.findOne({
            _id: id,
            organization: organizationId,
            recipient: recipientId,
        });

        if (!notification)
        {
            return NextResponse.json(
                { message: "Notification not found or access denied" },
                { status: 404 }
            );
        }

        // Mark as read
        notification.read = true;
        notification.readAt = new Date();
        await notification.save();

        return NextResponse.json(
            {
                success: true,
                message: "Notification marked as read",
                data: notification,
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/notifications/[id] - Delete a specific notification
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
)
{
    try
    {
        await connectDB();

        const { id } = params;
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get("organizationId");
        const recipientId = searchParams.get("recipientId");

        if (!organizationId || !recipientId)
        {
            return NextResponse.json(
                { message: "organizationId and recipientId are required" },
                { status: 400 }
            );
        }

        // Verify notification belongs to the user and organization
        const notification = await Notification.findOneAndDelete({
            _id: id,
            organization: organizationId,
            recipient: recipientId,
        });

        if (!notification)
        {
            return NextResponse.json(
                { message: "Notification not found or access denied" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Notification deleted successfully",
            },
            { status: 200 }
        );
    } catch (error)
    {
        console.error('Error deleting notification:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
