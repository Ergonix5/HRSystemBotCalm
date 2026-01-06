"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  color: string;
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  hasUnreadNotifications: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'approval',
    title: 'Leave Request Approved',
    description: 'Your vacation request for next month has been approved by your manager.',
    time: '2 hours ago',
    unread: true,
    color: 'blue'
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Timesheet Reminder',
    description: 'Please submit your timesheet for the current pay period by EOD Friday.',
    time: '5 hours ago',
    unread: true,
    color: 'yellow'
  },
  {
    id: 3,
    type: 'system',
    title: 'Welcome Message',
    description: 'Welcome to the employee portal! Check your profile to ensure details are correct.',
    time: '2 days ago',
    unread: false,
    color: 'green'
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const hasUnreadNotifications = notifications.some(n => n.unread);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      setNotifications, 
      hasUnreadNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}