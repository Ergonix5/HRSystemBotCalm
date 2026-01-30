"use client";

import { Bell, Check, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotifications } from "@/src/contexts/NotificationContext";
import { useRouter } from "next/navigation";

import
{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";

export default function Header()
{
  const [dateTime, setDateTime] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotifications();
  const router = useRouter();

  const recentNotifications = notifications.slice(0, 5);

  useEffect(() =>
  {
    const updateDateTime = () =>
    {
      const now = new Date();
      setDateTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) =>
  {
    const iconMap: Record<string, string> = {
      approval: "✅",
      rejection: "❌",
      reminder: "⏰",
      system: "🔔",
      announcement: "📢",
      alert: "⚠️",
    };
    return iconMap[type] || "🔔";
  };

  const formatTimeAgo = (date: Date) =>
  {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleMarkAsRead = async (notificationId: string, e?: React.MouseEvent) =>
  {
    if (e)
    {
      e.stopPropagation();
      e.preventDefault();
    }
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () =>
  {
    await markAllAsRead();
  };

  const handleNotificationClick = async (notification: any) =>
  {
    // Mark as read if unread
    if (!notification.read)
    {
      await markAsRead(notification._id);
    }

    // Close dropdown
    setDropdownOpen(false);

    // Navigate if there's an action URL
    if (notification.metadata?.actionUrl)
    {
      router.push(notification.metadata.actionUrl);
    }
  };

  const handleViewAll = () =>
  {
    setDropdownOpen(false);
    router.push("/dashboard/notifications");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-end gap-4 px-6 py-3 border-b  bg-gray-50">
      <span className="text-sm text-muted-foreground">{dateTime}</span>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-105">
          {/* Header */}
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>Notifications</span>
          </DropdownMenuLabel>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <div className="px-3 pb-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Notifications list */}
          {loading && recentNotifications.length === 0 ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : recentNotifications.length === 0 ? (
            <div className="p-4 text-sm text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <ScrollArea className="h-100">
              {recentNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm mx-1 ${!notification.read
                    ? "bg-blue-50 dark:bg-blue-950"
                    : ""
                    }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className="text-lg shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <button
                          className="h-6 w-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer shrink-0 transition-colors"
                          onClick={(e) => handleMarkAsRead(notification._id, e)}
                          aria-label="Mark as read"
                          type="button"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>

                    <span className="text-xs text-muted-foreground mt-1 block">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}

          <DropdownMenuSeparator />

          {/* View all */}
          <div className="p-1">
            <button
              className="w-full text-center font-medium cursor-pointer px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={handleViewAll}
              type="button"
            >
              View all notifications
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
