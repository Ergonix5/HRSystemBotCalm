"use client";

import Notifications from "@/src/components/employee-portal/profile/notifications/Notifications";
import { NotificationProvider } from "@/src/contexts/NotificationContext";

export default function NotificationsPage()
{
    return (
        <NotificationProvider>
            <Notifications />
        </NotificationProvider>
    );
}
