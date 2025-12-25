import React, { useState, useMemo } from 'react';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { Card, CardContent, CardHeader } from '../../../ui/card';
import { 
  PageHeader,
  NotificationTabs,
  NotificationList,
  NotificationFooter
} from './components';

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const { notifications, setNotifications } = useNotifications();

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter(n => n.unread);
    if (filter === 'read') return notifications.filter(n => !n.unread);
    return notifications;
  }, [filter, notifications]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-8">
      <PageHeader />
      
      <Card>
        <CardHeader>
          <NotificationTabs 
            filter={filter}
            onFilterChange={setFilter}
            unreadCount={unreadCount}
          />
        </CardHeader>

        <CardContent>
          <NotificationList 
            notifications={filteredNotifications}
            filter={filter}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
          />
        </CardContent>
        
        <NotificationFooter count={filteredNotifications.length} />
      </Card>
    </div>
  );
}