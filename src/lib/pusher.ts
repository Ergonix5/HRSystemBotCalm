// Pusher Configuration for Real-time Notifications
// This file provides both client-side and server-side Pusher instances

import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance (for triggering events)
let pusherServerInstance: Pusher | null = null;

export function getPusherServer(): Pusher
{
    if (!pusherServerInstance)
    {
        pusherServerInstance = new Pusher({
            appId: process.env.PUSHER_APP_ID || '',
            key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
            secret: process.env.PUSHER_SECRET || '',
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
            useTLS: true,
        });
    }
    return pusherServerInstance;
}

// Client-side Pusher instance (for subscribing to events)
let pusherClientInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient
{
    if (!pusherClientInstance)
    {
        pusherClientInstance = new PusherClient(
            process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
            {
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
                forceTLS: true,
            }
        );

        // Add connection event listeners for debugging
        pusherClientInstance.connection.bind('connected', () =>
        {
            console.log('✅ Pusher connected successfully');
        });

        pusherClientInstance.connection.bind('disconnected', () =>
        {
            console.log('❌ Pusher disconnected');
        });

        pusherClientInstance.connection.bind('failed', () =>
        {
            console.log('❌ Pusher connection failed');
        });

        pusherClientInstance.connection.bind('error', (err: any) =>
        {
            console.error('❌ Pusher connection error:', err);
        });

        pusherClientInstance.connection.bind('state_change', (states: any) =>
        {
            console.log('🔄 Pusher state change:', states.previous, '→', states.current);
        });
    }
    return pusherClientInstance;
}

// Channel naming conventions
export const getNotificationChannelName = (userId: string, organizationId: string) =>
{
    // Using public channels (for private channels, you need to set up authentication)
    // For production, consider implementing private channel authentication
    return `notifications-${organizationId}-${userId}`;
};

// Event names
export const PUSHER_EVENTS = {
    NEW_NOTIFICATION: 'new-notification',
    NOTIFICATION_READ: 'notification-read',
    NOTIFICATION_DELETED: 'notification-deleted',
    NOTIFICATIONS_READ_ALL: 'notifications-read-all',
    STATS_UPDATED: 'stats-updated',
} as const;

// Trigger a new notification event
export async function triggerNewNotification(
    userId: string,
    organizationId: string,
    notificationId: string
)
{
    try
    {
        const pusher = getPusherServer();
        const channel = getNotificationChannelName(userId, organizationId);

        await pusher.trigger(channel, PUSHER_EVENTS.NEW_NOTIFICATION, {
            notificationId,
            timestamp: new Date().toISOString(),
        });
    } catch (error)
    {
        console.error('Error triggering new notification event:', error);
    }
}

// Trigger notification read event
export async function triggerNotificationRead(
    userId: string,
    organizationId: string,
    notificationId: string
)
{
    try
    {
        const pusher = getPusherServer();
        const channel = getNotificationChannelName(userId, organizationId);

        await pusher.trigger(channel, PUSHER_EVENTS.NOTIFICATION_READ, {
            notificationId,
            timestamp: new Date().toISOString(),
        });
    } catch (error)
    {
        console.error('Error triggering notification read event:', error);
    }
}

// Trigger notification deleted event
export async function triggerNotificationDeleted(
    userId: string,
    organizationId: string,
    notificationId: string
)
{
    try
    {
        const pusher = getPusherServer();
        const channel = getNotificationChannelName(userId, organizationId);

        await pusher.trigger(channel, PUSHER_EVENTS.NOTIFICATION_DELETED, {
            notificationId,
            timestamp: new Date().toISOString(),
        });
    } catch (error)
    {
        console.error('Error triggering notification deleted event:', error);
    }
}

// Trigger all notifications read event
export async function triggerNotificationsReadAll(
    userId: string,
    organizationId: string
)
{
    try
    {
        const pusher = getPusherServer();
        const channel = getNotificationChannelName(userId, organizationId);

        await pusher.trigger(channel, PUSHER_EVENTS.NOTIFICATIONS_READ_ALL, {
            timestamp: new Date().toISOString(),
        });
    } catch (error)
    {
        console.error('Error triggering notifications read all event:', error);
    }
}

// Trigger stats updated event
export async function triggerStatsUpdated(
    userId: string,
    organizationId: string,
    stats: { total: number; unread: number }
)
{
    try
    {
        const pusher = getPusherServer();
        const channel = getNotificationChannelName(userId, organizationId);

        await pusher.trigger(channel, PUSHER_EVENTS.STATS_UPDATED, {
            stats,
            timestamp: new Date().toISOString(),
        });
    } catch (error)
    {
        console.error('Error triggering stats updated event:', error);
    }
}

// Check if Pusher is configured
export function isPusherConfigured(): boolean
{
    return !!(
        process.env.NEXT_PUBLIC_PUSHER_APP_KEY &&
        process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    );
}
