"use client";

import React, { useState, useMemo } from "react";
import { useNotifications } from "@/src/contexts/NotificationContext";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Search, RefreshCw, CheckCheck, Trash2, Check } from "lucide-react";
import
{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useRouter } from "next/navigation";

export default function NotificationsPage()
{
  const {
    notifications,
    stats,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();

  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter notifications
  const filteredNotifications = useMemo(() =>
  {
    let filtered = [...notifications];

    if (filter === "unread")
    {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter === "read")
    {
      filtered = filtered.filter((n) => n.read);
    }

    if (typeFilter !== "all")
    {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    if (searchQuery.trim())
    {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [notifications, filter, typeFilter, searchQuery]);

  const handleRefresh = async () =>
  {
    setIsRefreshing(true);
    await refreshNotifications();
    setTimeout(() => setIsRefreshing(false), 500);
  };

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

  const getPriorityColor = (priority: string) =>
  {
    const colorMap: Record<string, string> = {
      low: "text-gray-600",
      medium: "text-blue-600",
      high: "text-red-600",
    };
    return colorMap[priority] || colorMap.low;
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your notifications
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats?.total || 0}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Unread</p>
          <p className="text-2xl font-bold text-blue-600">{stats?.unread || 0}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Read</p>
          <p className="text-2xl font-bold text-gray-600">{stats?.read || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
              <SelectItem value="approval">Approval</SelectItem>
              <SelectItem value="rejection">Rejection</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>

          {(stats?.unread || 0) > 0 && (
            <Button variant="outline" onClick={() => markAllAsRead()}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="divide-y flex flex-col gap-1">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50 dark:bg-blue-950/20" : ""
                  }`}
                onClick={() =>
                {
                  if (!notification.read)
                  {
                    markAsRead(notification._id);
                  }
                  if (notification.metadata?.actionUrl)
                  {
                    router.push(notification.metadata.actionUrl);
                  }
                }}
              >
                {/* Icon */}
                <div className="text-2xl shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-semibold text-sm">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {notification.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(notification.created_at)}
                    </span>

                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={(e) =>
                          {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-red-600 hover:text-red-700"
                        onClick={(e) =>
                        {
                          e.stopPropagation();
                          if (confirm("Delete this notification?"))
                          {
                            deleteNotification(notification._id);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </p>
        </div>
      )}
    </div>
  );
}
