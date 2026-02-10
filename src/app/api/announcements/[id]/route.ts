import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { Announcement } from "../../../models/announcement.model";
import { validateBody } from "@/src/lib/validate";
import { z } from "zod";
import { logAction } from "@/src/lib/logger";

type Params = { params: Promise<{ id: string }> };

const UpdateAnnouncementSchema = z.object({
    organizationId: z.string().min(1),
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).max(5000).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    expiresAt: z.string().datetime().optional().nullable(),
});


// GET /api/announcements/[id] - Get single announcement

export async function GET(req: Request, { params }: Params) {
    try {
        await connectDB();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get('organizationId');

        if (!organizationId) {
            return NextResponse.json(
                { message: 'Organization ID is required' },
                { status: 400 }
            );
        }

        const announcement = await Announcement.findOne({
            _id: id,
            organization: organizationId,
        })
            .populate('author', 'first_name last_name email')
            .populate('organization', 'name');

        if (!announcement) {
            return NextResponse.json(
                { message: 'Announcement not found' },
                { status: 404 }
            );
        }

        // Increment view count
        announcement.viewCount += 1;
        await announcement.save();

        return NextResponse.json({
            success: true,
            data: announcement,
        });

    } catch (error: any) {
        console.error('Error fetching announcement:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}


// PATCH /api/announcements/[id] - Update announcement

export async function PATCH(req: Request, { params }: Params) {
    try {
        await connectDB();

        const { id } = await params;

        const result = await validateBody(req, UpdateAnnouncementSchema);
        if (!result.ok) return result.res;

        const data = result.data;

        const announcement = await Announcement.findOne({
            _id: id,
            organization: data.organizationId,
        });

        if (!announcement) {
            return NextResponse.json(
                { message: 'Announcement not found' },
                { status: 404 }
            );
        }

        // Update fields
        if (data.title) announcement.title = data.title;
        if (data.content) announcement.content = data.content;
        if (data.priority) announcement.priority = data.priority;
        if (data.expiresAt !== undefined) {
            announcement.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
        }

        // Handle status change
        if (data.status && data.status !== announcement.status) {
            announcement.status = data.status;
            if (data.status === 'published' && !announcement.publishedAt) {
                announcement.publishedAt = new Date();
            }
        }

        await announcement.save();

        const updatedAnnouncement = await Announcement.findById(id)
            .populate('author', 'first_name last_name email')
            .populate('organization', 'name');

        return NextResponse.json({
            success: true,
            message: 'Announcement updated successfully',
            data: updatedAnnouncement,
        });

        await logAction("ANNOUNCEMENT_UPDATE", {
            announcementId: updatedAnnouncement._id,
            title: updatedAnnouncement.title,
            updatedFields: Object.keys(data)
        });

    } catch (error: any) {
        console.error('Error updating announcement:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}


// DELETE /api/announcements/[id] - Delete announcement

export async function DELETE(req: Request, { params }: Params) {
    try {
        await connectDB();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get('organizationId');

        if (!organizationId) {
            return NextResponse.json(
                { message: 'Organization ID is required' },
                { status: 400 }
            );
        }

        const announcement = await Announcement.findOneAndDelete({
            _id: id,
            organization: organizationId,
        });

        if (!announcement) {
            return NextResponse.json(
                { message: 'Announcement not found' },
                { status: 404 }
            );
        }

        await logAction("ANNOUNCEMENT_DELETE", {
            announcementId: id,
            title: announcement.title,
            organizationId: organizationId
        });

        return NextResponse.json({
            success: true,
            message: 'Announcement deleted successfully',
        });

    } catch (error: any) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
