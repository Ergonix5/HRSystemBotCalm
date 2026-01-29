import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { Announcement } from "../../models/announcement.model";
import { Employee } from "../../models/employee.model";
import { validateBody } from "@/src/lib/validate";
import { z } from "zod";
import { createBulkNotifications } from "../../service/notification.service";

// Validation schema for creating announcements
const AnnouncementSchema = z.object({
    organizationId: z.string().min(1, 'Organization ID is required'),
    authorId: z.string().min(1, 'Author ID is required'),
    title: z.string().min(1, 'Title is required').max(200),
    content: z.string().min(1, 'Content is required').max(5000),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
    target: z.enum(['all', 'department', 'specific']).optional().default('all'),
    targetDepartments: z.array(z.string()).optional(),
    targetEmployees: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published']).optional().default('draft'),
    expiresAt: z.string().datetime().optional(),
    sendNotification: z.boolean().optional().default(true),
});


// POST /api/announcements - Create new announcement
// Body: { organizationId, authorId, title, content, priority, target, status, sendNotification }

export async function POST(req: Request)
{
    try
    {
        await connectDB();

        const result = await validateBody(req, AnnouncementSchema);
        if (!result.ok) return result.res;

        const data = result.data;

        // Verify author exists
        const author = await Employee.findById(data.authorId);
        if (!author || author.organization.toString() !== data.organizationId)
        {
            return NextResponse.json(
                { message: 'Author not found or does not belong to organization' },
                { status: 400 }
            );
        }

        // Create announcement
        const announcement = await Announcement.create({
            organization: data.organizationId,
            author: data.authorId,
            title: data.title,
            content: data.content,
            priority: data.priority,
            target: data.target,
            targetDepartments: data.targetDepartments || [],
            targetEmployees: data.targetEmployees || [],
            status: data.status,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            publishedAt: data.status === 'published' ? new Date() : null,
        });

        // Send notifications if published and notification requested
        if (data.status === 'published' && data.sendNotification)
        {
            try
            {
                let recipientIds: string[] = [];

                if (data.target === 'all')
                {
                    // Get all active employees in organization
                    const employees = await Employee.find({
                        organization: data.organizationId,
                        employment_status: 'Active',
                    }).select('_id');
                    recipientIds = employees.map(e => e._id.toString());
                } else if (data.target === 'department' && data.targetDepartments && data.targetDepartments.length > 0)
                {
                    // Get employees in specific departments
                    const employees = await Employee.find({
                        organization: data.organizationId,
                        designation: { $in: data.targetDepartments },
                        employment_status: 'Active',
                    }).select('_id');
                    recipientIds = employees.map(e => e._id.toString());
                } else if (data.target === 'specific' && data.targetEmployees && data.targetEmployees.length > 0)
                {
                    // Use specific employee list
                    recipientIds = data.targetEmployees;
                }

                if (recipientIds.length > 0)
                {
                    // Determine notification priority based on announcement priority
                    const notificationPriority = data.priority === 'urgent' ? 'high' :
                        data.priority === 'high' ? 'high' : 'medium';

                    await createBulkNotifications({
                        organizationId: data.organizationId,
                        recipientIds: recipientIds,
                        type: 'announcement',
                        title: `📢 ${data.title}`,
                        message: data.content.substring(0, 200) + (data.content.length > 200 ? '...' : ''),
                        priority: notificationPriority,
                        metadata: {
                            announcementId: announcement._id.toString(),
                            actionUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/announcements/${announcement._id}`
                        },
                        sendEmail: data.priority === 'urgent' || data.priority === 'high',
                    });

                    // Mark notification as sent
                    announcement.notificationSent = true;
                    await announcement.save();
                }
            } catch (notificationError)
            {
                console.error('Failed to send announcement notifications:', notificationError);
            }
        }

        const populatedAnnouncement = await Announcement.findById(announcement._id)
            .populate('author', 'first_name last_name email')
            .populate('organization', 'name');

        return NextResponse.json({
            success: true,
            message: 'Announcement created successfully',
            data: populatedAnnouncement,
        }, { status: 201 });

    } catch (error: any)
    {
        console.error('Error creating announcement:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}


// GET /api/announcements - Fetch announcements
// Query params: organizationId, status, page, limit

export async function GET(req: Request)
{
    try
    {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get('organizationId');
        const status = searchParams.get('status') || 'published';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!organizationId)
        {
            return NextResponse.json(
                { message: 'Organization ID is required' },
                { status: 400 }
            );
        }

        const filter: any = { organization: organizationId };

        if (status && status !== 'all')
        {
            filter.status = status;
        }

        // Only show non-expired announcements
        const now = new Date();
        filter.$or = [
            { expiresAt: null },
            { expiresAt: { $gt: now } }
        ];

        const skip = (page - 1) * limit;

        const [announcements, total] = await Promise.all([
            Announcement.find(filter)
                .populate('author', 'first_name last_name email')
                .sort({ publishedAt: -1, created_at: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Announcement.countDocuments(filter)
        ]);

        return NextResponse.json({
            success: true,
            data: announcements,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error: any)
    {
        console.error('Error fetching announcements:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
