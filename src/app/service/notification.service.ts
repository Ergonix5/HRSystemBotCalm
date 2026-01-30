import { Notification } from "../models/notification.model";
import { Employee } from "../models/employee.model";
import { sendEmail } from "./email.service";
import { Types } from "mongoose";

export interface NotificationData
{
    organizationId: string;
    recipientId: string;
    type: 'approval' | 'rejection' | 'reminder' | 'system' | 'announcement' | 'alert';
    title: string;
    message: string;
    metadata?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high';
    expiresAt?: Date;
    sendEmail?: boolean;
}

export interface BulkNotificationData
{
    organizationId: string;
    recipientIds: string[];
    type: 'approval' | 'rejection' | 'reminder' | 'system' | 'announcement' | 'alert';
    title: string;
    message: string;
    metadata?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high';
    expiresAt?: Date;
    sendEmail?: boolean;
}


// Create a single notification

export async function createNotification(data: NotificationData)
{
    try
    {
        // Verify recipient exists and belongs to organization
        const recipient = await Employee.findOne({
            _id: data.recipientId,
            organization: data.organizationId
        }).select('email first_name last_name');

        if (!recipient)
        {
            throw new Error('Recipient not found in organization');
        }

        // Create notification in database
        const notification = await Notification.create({
            organization: data.organizationId,
            recipient: data.recipientId,
            type: data.type,
            title: data.title,
            message: data.message,
            metadata: data.metadata || {},
            priority: data.priority || 'medium',
            expiresAt: data.expiresAt || null,
            read: false,
            emailSent: false,
        });

        // Send email if requested
        if (data.sendEmail)
        {
            try
            {
                await sendNotificationEmail(
                    recipient.email,
                    `${recipient.first_name} ${recipient.last_name}`,
                    data.title,
                    data.message,
                    data.metadata
                );

                // Update notification to mark email as sent
                await Notification.findByIdAndUpdate(notification._id, {
                    emailSent: true,
                    emailSentAt: new Date()
                });
            } catch (emailError)
            {
                console.error('Failed to send notification email:', emailError);
            }
        }

        return {
            success: true,
            notification: notification.toObject(),
        };
    } catch (error)
    {
        console.error('Error creating notification:', error);
        throw error;
    }
}


// Create multiple notifications at once (bulk)
export async function createBulkNotifications(data: BulkNotificationData)
{
    try
    {
        // Verify all recipients exist and belong to organization
        const recipients = await Employee.find({
            _id: { $in: data.recipientIds },
            organization: data.organizationId
        }).select('_id email first_name last_name');

        if (recipients.length === 0)
        {
            throw new Error('No valid recipients found in organization');
        }

        // Create notifications for all recipients
        const notifications = recipients.map(recipient => ({
            organization: data.organizationId,
            recipient: recipient._id,
            type: data.type,
            title: data.title,
            message: data.message,
            metadata: data.metadata || {},
            priority: data.priority || 'medium',
            expiresAt: data.expiresAt || null,
            read: false,
            emailSent: false,
        }));

        const createdNotifications = await Notification.insertMany(notifications);

        // Send emails if requested
        if (data.sendEmail)
        {
            const emailPromises = recipients.map(async (recipient) =>
            {
                try
                {
                    await sendNotificationEmail(
                        recipient.email,
                        `${recipient.first_name} ${recipient.last_name}`,
                        data.title,
                        data.message,
                        data.metadata
                    );

                    // Mark email as sent for this recipient's notification
                    await Notification.findOneAndUpdate(
                        {
                            recipient: recipient._id,
                            _id: { $in: createdNotifications.map(n => n._id) }
                        },
                        {
                            emailSent: true,
                            emailSentAt: new Date()
                        }
                    );
                } catch (emailError)
                {
                    console.error(`Failed to send email to ${recipient.email}:`, emailError);
                }
            });

            // Send all emails in parallel (don't wait for completion)
            Promise.allSettled(emailPromises);
        }

        return {
            success: true,
            count: createdNotifications.length,
            notifications: createdNotifications,
        };
    } catch (error)
    {
        console.error('Error creating bulk notifications:', error);
        throw error;
    }
}

// Send notification email using existing email service
async function sendNotificationEmail(
    to: string,
    recipientName: string,
    title: string,
    message: string,
    metadata?: Record<string, any>
)
{
    const actionUrl = metadata?.actionUrl || process.env.NEXT_PUBLIC_API_URL;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .header {
                    border-bottom: 3px solid #4F46E5;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    margin: 0;
                    color: #4F46E5;
                    font-size: 24px;
                }
                .content {
                    margin: 20px 0;
                }
                .message {
                    background-color: #F3F4F6;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #4F46E5;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #E5E7EB;
                    font-size: 12px;
                    color: #6B7280;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔔 ${title}</h1>
                </div>
                <div class="content">
                    <p>Hi ${recipientName},</p>
                    <div class="message">
                        <p>${message}</p>
                    </div>
                    ${actionUrl ? `<a href="${actionUrl}" class="button">View Details</a>` : ''}
                </div>
                <div class="footer">
                    <p>This is an automated notification from SOLID-HR-System.</p>
                    <p>Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail({
        to,
        subject: title,
        html,
    });
}

// Get notification statistics for a user
export async function getNotificationStats(recipientId: string, organizationId: string)
{
    try
    {
        const [total, unread, byType] = await Promise.all([
            // Total notifications
            Notification.countDocuments({
                recipient: recipientId,
                organization: organizationId,
            }),

            // Unread count
            Notification.countDocuments({
                recipient: recipientId,
                organization: organizationId,
                read: false,
            }),

            // Count by type
            Notification.aggregate([
                {
                    $match: {
                        recipient: new Types.ObjectId(recipientId),
                        organization: new Types.ObjectId(organizationId),
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 },
                        unread: {
                            $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
                        }
                    }
                }
            ])
        ]);

        return {
            total,
            unread,
            read: total - unread,
            byType: byType.reduce((acc, item) =>
            {
                acc[item._id] = {
                    total: item.count,
                    unread: item.unread,
                };
                return acc;
            }, {} as Record<string, { total: number; unread: number }>),
        };
    } catch (error)
    {
        console.error('Error getting notification stats:', error);
        throw error;
    }
}

// Delete old/expired notifications (cleanup job)
export async function cleanupExpiredNotifications(daysOld: number = 90)
{
    try
    {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await Notification.deleteMany({
            $or: [
                // Delete notifications older than cutoff date and already read
                {
                    created_at: { $lt: cutoffDate },
                    read: true,
                },
                // Delete expired notifications
                {
                    expiresAt: { $lt: new Date() }
                }
            ]
        });

        return {
            success: true,
            deletedCount: result.deletedCount,
        };
    } catch (error)
    {
        console.error('Error cleaning up notifications:', error);
        throw error;
    }
}

// Notification templates for common events
export const NotificationTemplates = {
    leaveRequestSubmitted: (employeeName: string, leaveType: string, startDate: string, endDate: string) => ({
        title: 'New Leave Request Submitted',
        message: `${employeeName} has submitted a ${leaveType} request from ${startDate} to ${endDate}. Please review and approve/reject.`,
        type: 'system' as const,
        priority: 'medium' as const,
    }),

    leaveRequestApproved: (leaveType: string, startDate: string, endDate: string, approverName: string) => ({
        title: 'Leave Request Approved',
        message: `Your ${leaveType} request from ${startDate} to ${endDate} has been approved by ${approverName}.`,
        type: 'approval' as const,
        priority: 'high' as const,
    }),

    leaveRequestRejected: (leaveType: string, startDate: string, endDate: string, reason?: string) => ({
        title: 'Leave Request Rejected',
        message: `Your ${leaveType} request from ${startDate} to ${endDate} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
        type: 'rejection' as const,
        priority: 'high' as const,
    }),

    timesheetReminder: () => ({
        title: 'Timesheet Reminder',
        message: 'Please submit your timesheet for the current pay period by end of day Friday.',
        type: 'reminder' as const,
        priority: 'medium' as const,
    }),

    leaveBalanceAlert: (leaveType: string, remainingDays: number) => ({
        title: 'Leave Balance Update',
        message: `You have ${remainingDays} ${leaveType} days remaining for this year.`,
        type: 'alert' as const,
        priority: 'low' as const,
    }),

    systemAnnouncement: (announcementTitle: string, announcementMessage: string) => ({
        title: announcementTitle,
        message: announcementMessage,
        type: 'announcement' as const,
        priority: 'medium' as const,
    }),

    welcomeMessage: (employeeName: string) => ({
        title: 'Welcome to SOLID-HR-System!',
        message: `Welcome ${employeeName}! Please complete your profile and review company policies.`,
        type: 'system' as const,
        priority: 'high' as const,
    }),
};
