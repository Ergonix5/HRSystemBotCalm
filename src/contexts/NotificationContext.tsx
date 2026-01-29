"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from '../app/store/authStore';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { isPusherConfigured } from '../lib/pusher';

interface Notification
{
  _id: string;
  organization: string;
  recipient: string;
  type: 'approval' | 'rejection' | 'reminder' | 'system' | 'announcement' | 'alert';
  title: string;
  message: string;
  metadata?: Record<string, any>;
  read: boolean;
  readAt: Date | null;
  priority: 'low' | 'medium' | 'high';
  expiresAt: Date | null;
  emailSent: boolean;
  emailSentAt: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface NotificationStats
{
  total: number;
  unread: number;
  read: number;
  byType: Record<string, number>;
}

interface NotificationContextType
{
  notifications: Notification[];
  stats: NotificationStats | null;
  loading: boolean;
  error: string | null;
  fetchNotifications: (page?: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  hasUnreadNotifications: boolean;
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode })
{
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const initialFetchDone = useRef(false);

  // Get user and organization IDs from auth store
  const userId = user?.id;
  const organizationId = user?.organization_id; // Fixed: API returns organization_id, not organization

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (page = 1) =>
  {
    if (!userId || !organizationId) return;

    try
    {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/notifications?recipientId=${userId}&organizationId=${organizationId}&page=${page}&limit=20`
      );

      if (!response.ok)
      {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();

      console.log('📥 Notifications fetched:', data);

      // API returns paginated result: { data: [...], total, page, limit, unreadCount }
      if (data.data && Array.isArray(data.data))
      {
        setNotifications(data.data);

        // Check for new notifications and play sound
        if (data.data.length > 0 && lastNotificationId)
        {
          const latestId = data.data[0]._id;
          if (latestId !== lastNotificationId)
          {
            // New notification detected
            playNotificationSound();
            showBrowserNotification(data.data[0]);
          }
          setLastNotificationId(latestId);
        } else if (data.data.length > 0 && !lastNotificationId)
        {
          setLastNotificationId(data.data[0]._id);
        }
      } else
      {
        console.warn('⚠️ Unexpected API response:', data);
        setNotifications([]);
      }
    } catch (err: any)
    {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally
    {
      setLoading(false);
    }
  }, [userId, organizationId, lastNotificationId]);

  // Fetch notification statistics
  const fetchStats = useCallback(async () =>
  {
    if (!userId || !organizationId) return;

    try
    {
      const response = await fetch(
        `/api/notifications/stats?recipientId=${userId}&organizationId=${organizationId}`
      );

      if (!response.ok)
      {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();

      console.log('📊 Stats fetched:', data);

      // API returns stats wrapped in data: { success: true, data: { total, unread, read } }
      if (data.success && data.data)
      {
        setStats(data.data);
      }
      else if (data.total !== undefined)
      {
        // Fallback: if API returns stats directly
        setStats(data);
      }
      else
      {
        console.warn('⚠️ Unexpected stats response:', data);
      }
    } catch (err: any)
    {
      console.error('❌ Error fetching stats:', err);
    }
  }, [userId, organizationId]);

  // Mark single notification as read
  const markAsRead = useCallback(async (id: string) =>
  {
    if (!userId || !organizationId)
    {
      console.warn('⚠️ Cannot mark as read: missing userId or organizationId');
      return;
    }

    try
    {
      console.log('📝 Marking notification as read:', { id, userId, organizationId });

      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId, organizationId }),
      });

      const data = await response.json();
      console.log('📥 Mark as read response:', data);

      if (!response.ok)
      {
        throw new Error(data.message || 'Failed to mark as read');
      }

      // Update local state
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true, readAt: new Date() } : n)
      );

      // Refresh stats
      await fetchStats();
    } catch (err: any)
    {
      console.error('❌ Error marking as read:', err);
      // Show error to user
      alert(`Failed to mark notification as read: ${err.message}`);
    }
  }, [userId, organizationId, fetchStats]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () =>
  {
    if (!userId || !organizationId) return;

    try
    {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId, organizationId }),
      });

      if (!response.ok)
      {
        throw new Error('Failed to mark all as read');
      }

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, readAt: new Date() }))
      );

      // Refresh stats
      await fetchStats();
    } catch (err: any)
    {
      console.error('Error marking all as read:', err);
    }
  }, [userId, organizationId, fetchStats]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) =>
  {
    if (!userId || !organizationId) return;

    try
    {
      const response = await fetch(
        `/api/notifications/${id}?recipientId=${userId}&organizationId=${organizationId}`,
        { method: 'DELETE' }
      );

      if (!response.ok)
      {
        throw new Error('Failed to delete notification');
      }

      // Update local state
      setNotifications(prev => prev.filter(n => n._id !== id));

      // Refresh stats
      await fetchStats();
    } catch (err: any)
    {
      console.error('Error deleting notification:', err);
    }
  }, [userId, organizationId, fetchStats]);

  // Refresh notifications (for manual refresh)
  const refreshNotifications = useCallback(async () =>
  {
    await Promise.all([fetchNotifications(), fetchStats()]);
  }, [fetchNotifications, fetchStats]);

  // Play notification sound
  const playNotificationSound = () =>
  {
    try
    {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Could not play sound:', err));
    } catch (err)
    {
      console.log('Audio not supported');
    }
  };

  // Show browser notification
  const showBrowserNotification = (notification: Notification) =>
  {
    if ('Notification' in window && Notification.permission === 'granted')
    {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png',
      });
    }
  };

  // Request notification permission
  useEffect(() =>
  {
    if ('Notification' in window && Notification.permission === 'default')
    {
      Notification.requestPermission();
    }
  }, []);

  // Initial fetch - only run once when user/org IDs are available
  useEffect(() =>
  {
    if (userId && organizationId && !initialFetchDone.current)
    {
      initialFetchDone.current = true;
      fetchNotifications();
      fetchStats();
    }
  }, [userId, organizationId]); // Removed fetchNotifications and fetchStats to prevent infinite loops

  // Polling for new notifications (every 30 seconds) - ONLY when Pusher is not configured
  useEffect(() =>
  {
    if (!userId || !organizationId) return;

    // Only poll if Pusher is not configured (to avoid duplicate fetches)
    const pusherConfigured = isPusherConfigured();
    if (pusherConfigured)
    {
      console.log('✅ Pusher is configured, skipping polling');
      return;
    }

    console.log('⏰ Pusher not configured, starting polling fallback');
    const interval = setInterval(() =>
    {
      console.log('🔄 Polling for notifications...');
      fetchNotifications();
      fetchStats();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [userId, organizationId]); // Removed fetchNotifications and fetchStats to prevent re-creating interval

  // Real-time notification handlers
  const handleNewNotification = useCallback(async (data: { notificationId: string; timestamp: string }) =>
  {
    console.log('New notification received:', data);

    // Fetch the new notification
    await fetchNotifications();
    await fetchStats();

    // Play sound and show browser notification
    playNotificationSound();

    // Fetch full notification details for browser notification
    try
    {
      const response = await fetch(`/api/notifications/${data.notificationId}?organizationId=${organizationId}`);
      if (response.ok)
      {
        const result = await response.json();
        if (result.data)
        {
          showBrowserNotification(result.data);
        }
      }
    } catch (err)
    {
      console.error('Error fetching notification details:', err);
    }
  }, [fetchNotifications, fetchStats, organizationId]);

  const handleNotificationRead = useCallback(async (data: { notificationId: string; timestamp: string }) =>
  {
    console.log('Notification marked as read:', data);

    // Update local state
    setNotifications(prev =>
      prev.map(n => n._id === data.notificationId ? { ...n, read: true, readAt: new Date() } : n)
    );

    // Refresh stats
    await fetchStats();
  }, [fetchStats]);

  const handleNotificationDeleted = useCallback(async (data: { notificationId: string; timestamp: string }) =>
  {
    console.log('Notification deleted:', data);

    // Remove from local state
    setNotifications(prev => prev.filter(n => n._id !== data.notificationId));

    // Refresh stats
    await fetchStats();
  }, [fetchStats]);

  const handleNotificationsReadAll = useCallback(async (data: { timestamp: string }) =>
  {
    console.log('All notifications marked as read:', data);

    // Update local state
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true, readAt: new Date() }))
    );

    // Refresh stats
    await fetchStats();
  }, [fetchStats]);

  // Subscribe to real-time notifications
  const { isPusherConfigured: pusherConfigured, isConnected } = useRealtimeNotifications({
    userId,
    organizationId,
    onNewNotification: handleNewNotification,
    onNotificationRead: handleNotificationRead,
    onNotificationDeleted: handleNotificationDeleted,
    onNotificationsReadAll: handleNotificationsReadAll,
    enabled: true,
  });

  // Log connection status
  useEffect(() =>
  {
    if (pusherConfigured)
    {
      console.log('Pusher configured:', pusherConfigured);
      console.log('Pusher connected:', isConnected());
    } else
    {
      console.log('Pusher not configured, using polling fallback');
    }
  }, [pusherConfigured, isConnected]);

  const hasUnreadNotifications = notifications.some(n => !n.read);
  const unreadCount = stats?.unread || 0;

  return (
    <NotificationContext.Provider value={{
      notifications,
      stats,
      loading,
      error,
      fetchNotifications,
      fetchStats,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      hasUnreadNotifications,
      unreadCount,
      refreshNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications()
{
  const context = useContext(NotificationContext);
  if (context === undefined)
  {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}