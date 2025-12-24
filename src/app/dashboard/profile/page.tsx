"use client";

import { useState } from "react";
import { Calendar, FileText, Clock, BarChart3 } from "lucide-react";
import ProfileHeader from "../../../components/employee-portal/profile/profile/ProfileHeader";
import NavigationTabs from "../../../components/employee-portal/NavigationTabs";
import Dashboard from "../../../components/employee-portal/profile/dashboard/Dashboard";
import RequestLeave from "../../../components/employee-portal/profile/request/RequestLeave";
import LeaveHistory from "../../../components/employee-portal/profile/history/LeaveHistory";
import WorkHours from "../../../components/employee-portal/profile/hours/WorkHours";
import Notifications from "../../../components/employee-portal/profile/notifications/Notifications";
import { NotificationProvider } from "../../../contexts/NotificationContext";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "request":
        return <RequestLeave />;
      case "history":
        return <LeaveHistory />;
      case "hours":
        return <WorkHours />;
      case "notifications":
        return <Notifications />;
      case "profile":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <ProfileHeader />
          <div className="mt-4 md:mt-6">
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="mt-4 md:mt-6 pb-20 md:pb-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}