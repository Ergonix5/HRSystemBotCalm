import { z } from 'zod';

export const NotificationSchema = z.object({
    organizationId: z.string().min(1, 'Organization ID is required'),
    recipientId: z.string().min(1, 'Recipient ID is required'),
    type: z.enum(['approval', 'rejection', 'reminder', 'system', 'announcement', 'alert']),
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
    metadata: z.record(z.any(), z.any()).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    expiresAt: z.string().datetime().optional(),
    sendEmail: z.boolean().optional().default(false),
});

export const BulkNotificationSchema = z.object({
    organizationId: z.string().min(1, 'Organization ID is required'),
    recipientIds: z.array(z.string()).min(1, 'At least one recipient is required'),
    type: z.enum(['approval', 'rejection', 'reminder', 'system', 'announcement', 'alert']),
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters'),
    metadata: z.record(z.any(), z.any()).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    expiresAt: z.string().datetime().optional(),
    sendEmail: z.boolean().optional().default(false),
});

export const MarkAsReadSchema = z.object({
    notificationId: z.string().min(1, 'Notification ID is required'),
});

export const NotificationQuerySchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('20'),
    type: z.enum(['approval', 'rejection', 'reminder', 'system', 'announcement', 'alert']).optional(),
    read: z.enum(['true', 'false']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
});
