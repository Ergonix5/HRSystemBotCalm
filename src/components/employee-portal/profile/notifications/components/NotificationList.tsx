import { NotificationItem, type Notification } from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  filter: string;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export function NotificationList({ notifications, filter, onMarkAsRead, onDelete }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-8 lg:p-16 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-xs lg:text-base font-medium">
          No {filter !== 'all' ? filter : ''} notifications found
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}