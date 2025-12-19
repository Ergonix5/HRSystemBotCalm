"use client";

import { Calendar, FileText, Clock, BarChart3 } from "lucide-react";
import ProfileHeader from "../../../components/profile/ProfileHeader";
import NavigationTabs from "../../../components/profile/NavigationTabs";
import StatsCard from "../../../components/profile/StatsCard";
import UpcomingLeaves from "../../../components/profile/UpcomingLeaves";
import RecentActivity from "../../../components/profile/RecentActivity";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ProfileHeader />
      <NavigationTabs activeTab="profile" />
      
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
    </div>
  );
}