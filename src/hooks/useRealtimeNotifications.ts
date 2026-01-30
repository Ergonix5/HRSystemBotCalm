"use client";

import { useEffect, useCallback, useRef } from 'react';
import { getPusherClient, getNotificationChannelName, PUSHER_EVENTS, isPusherConfigured } from '@/src/lib/pusher';
import type { Channel } from 'pusher-js';

interface UseRealtimeNotificationsProps
{
    userId: string | undefined;
    organizationId: string | undefined;
    onNewNotification?: (data: { notificationId: string; timestamp: string }) => void;
    onNotificationRead?: (data: { notificationId: string; timestamp: string }) => void;
    onNotificationDeleted?: (data: { notificationId: string; timestamp: string }) => void;
    onNotificationsReadAll?: (data: { timestamp: string }) => void;
    onStatsUpdated?: (data: { stats: { total: number; unread: number }; timestamp: string }) => void;
    enabled?: boolean;
}

export function useRealtimeNotifications({
    userId,
    organizationId,
    onNewNotification,
    onNotificationRead,
    onNotificationDeleted,
    onNotificationsReadAll,
    onStatsUpdated,
    enabled = true,
}: UseRealtimeNotificationsProps)
{
    const channelRef = useRef<Channel | null>(null);
    const pusherRef = useRef<ReturnType<typeof getPusherClient> | null>(null);

    // Subscribe to real-time events
    useEffect(() =>
    {
        console.log('🔍 useRealtimeNotifications effect running', {
            enabled,
            userId,
            organizationId,
            isPusherConfigured: isPusherConfigured()
        });

        // Don't subscribe if disabled, user not available, or Pusher not configured
        if (!enabled || !userId || !organizationId || !isPusherConfigured())
        {
            console.log('⏭️ Skipping Pusher subscription:', {
                enabled,
                hasUserId: !!userId,
                hasOrgId: !!organizationId,
                isPusherConfigured: isPusherConfigured()
            });
            return;
        }

        try
        {
            console.log('🚀 Initializing Pusher client...');

            // Get Pusher client instance
            const pusher = getPusherClient();
            pusherRef.current = pusher;

            console.log('📡 Pusher client created, connection state:', pusher.connection.state);

            // Get channel name
            const channelName = getNotificationChannelName(userId, organizationId);
            console.log('📢 Subscribing to channel:', channelName);

            // Subscribe to channel
            const channel = pusher.subscribe(channelName);
            channelRef.current = channel;

            // Bind event handlers
            if (onNewNotification)
            {
                channel.bind(PUSHER_EVENTS.NEW_NOTIFICATION, onNewNotification);
            }

            if (onNotificationRead)
            {
                channel.bind(PUSHER_EVENTS.NOTIFICATION_READ, onNotificationRead);
            }

            if (onNotificationDeleted)
            {
                channel.bind(PUSHER_EVENTS.NOTIFICATION_DELETED, onNotificationDeleted);
            }

            if (onNotificationsReadAll)
            {
                channel.bind(PUSHER_EVENTS.NOTIFICATIONS_READ_ALL, onNotificationsReadAll);
            }

            if (onStatsUpdated)
            {
                channel.bind(PUSHER_EVENTS.STATS_UPDATED, onStatsUpdated);
            }

            console.log(`Subscribed to real-time notifications: ${channelName}`);

            // Cleanup on unmount
            return () =>
            {
                if (channel)
                {
                    // Unbind all events
                    if (onNewNotification)
                    {
                        channel.unbind(PUSHER_EVENTS.NEW_NOTIFICATION, onNewNotification);
                    }
                    if (onNotificationRead)
                    {
                        channel.unbind(PUSHER_EVENTS.NOTIFICATION_READ, onNotificationRead);
                    }
                    if (onNotificationDeleted)
                    {
                        channel.unbind(PUSHER_EVENTS.NOTIFICATION_DELETED, onNotificationDeleted);
                    }
                    if (onNotificationsReadAll)
                    {
                        channel.unbind(PUSHER_EVENTS.NOTIFICATIONS_READ_ALL, onNotificationsReadAll);
                    }
                    if (onStatsUpdated)
                    {
                        channel.unbind(PUSHER_EVENTS.STATS_UPDATED, onStatsUpdated);
                    }

                    // Unsubscribe from channel
                    pusher.unsubscribe(channelName);
                    console.log(`Unsubscribed from real-time notifications: ${channelName}`);
                }
            };
        } catch (error)
        {
            console.error('Error setting up real-time notifications:', error);
        }
    }, [
        userId,
        organizationId,
        enabled,
        onNewNotification,
        onNotificationRead,
        onNotificationDeleted,
        onNotificationsReadAll,
        onStatsUpdated,
    ]);

    // Get connection state
    const getConnectionState = useCallback(() =>
    {
        if (!pusherRef.current) return 'disconnected';
        return pusherRef.current.connection.state;
    }, []);

    // Check if connected
    const isConnected = useCallback(() =>
    {
        return getConnectionState() === 'connected';
    }, [getConnectionState]);

    return {
        channel: channelRef.current,
        pusher: pusherRef.current,
        getConnectionState,
        isConnected,
        isPusherConfigured: isPusherConfigured(),
    };
}
