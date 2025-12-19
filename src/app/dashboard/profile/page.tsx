"use client";

import { useState } from "react";
import { Calendar, FileText, Clock, BarChart3 } from "lucide-react";
import ProfileHeader from "../../../components/employee-portal/profile/profile/ProfileHeader";
import NavigationTabs from "../../../components/employee-portal/profile/NavigationTabs";
import StatsCard from "../../../components/employee-portal/profile/dashboard/StatsCard";
import UpcomingLeaves from "../../../components/employee-portal/profile/dashboard/UpcomingLeaves";
import RecentActivity from "../../../components/employee-portal/profile/dashboard/RecentActivity";
import DashboardTab from "../../../components/employee-portal/profile/dashboard/DashboardTab";
import RequestLeaveTab from "../../../components/employee-portal/profile/request/RequestLeaveTab";
import LeaveHistoryTab from "../../../components/employee-portal/profile/history/LeaveHistoryTab";
import WorkHoursTab from "../../../components/employee-portal/profile/hours/WorkHoursTab";
import NotificationsTab from "../../../components/employee-portal/profile/notifications/NotificationsTab";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "request":
        return <RequestLeaveTab />;
      case "history":
        return <LeaveHistoryTab />;
      case "hours":
        return <WorkHoursTab />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return (
          <>
            <div className="grid grid-cols-4 gap-6 mb-8">
              <StatsCard 
                icon={Calendar}
                current={18}
                total={25}
                label="Remaining Leave Days"
                value={18}
                unit="days"
                percentage={72}
              />
              <StatsCard 
                icon={Clock}
                current={32}
                total={40}
                label="Hours This Week"
                value={32}
                unit="hours"
                percentage={80}
              />
              <StatsCard 
                icon={BarChart3}
                current={142}
                total={160}
                label="Hours This Month"
                value={142}
                unit="hours"
                percentage={89}
              />
              <StatsCard 
                icon={FileText}
                current={5}
                total={7}
                label="Approved Leaves"
                value={5}
                unit="leaves"
                percentage={71}
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <UpcomingLeaves />
              <RecentActivity />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ProfileHeader />
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
}