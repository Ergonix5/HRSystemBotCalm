"use client";

import { Button } from "../ui/button";
import { Calendar, FileText, Clock, User, Bell, BarChart3 } from "lucide-react";

interface NavigationTabsProps {
  activeTab?: string;
}

export default function NavigationTabs({ activeTab = "profile" }: NavigationTabsProps) {
  const getButtonClass = (tabName: string) => {
    return activeTab === tabName
      ? "gap-2 bg-gradient-to-r from-[#B91434] to-[#D91A47] text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
      : "gap-2 text-gray-600 bg-transparent hover:bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105";
  };

  return (
    <div className="flex gap-4 mb-8 bg-white rounded-2xl px-3 py-3 shadow-lg border border-gray-100 justify-center">
      <Button className={getButtonClass("dashboard")}>
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </Button>
      <Button className={getButtonClass("request")}>
        <FileText className="h-4 w-4" />
        Request Leave
      </Button>
      <Button className={getButtonClass("history")}>
        <Calendar className="h-4 w-4" />
        Leave History
      </Button>
      <Button className={getButtonClass("hours")}>
        <Clock className="h-4 w-4" />
        Work Hours
      </Button>
      <Button className={getButtonClass("notifications")}>
        <Bell className="h-4 w-4" />
        Notifications
      </Button>
      <Button className={getButtonClass("profile")}>
        <User className="h-4 w-4" />
        Profile
      </Button>
    </div>
  );
}