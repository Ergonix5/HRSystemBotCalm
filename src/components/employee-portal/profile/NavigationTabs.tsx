"use client";

import {
  Calendar,
  FileText,
  Clock,
  User,
  Bell,
  BarChart3,
} from "lucide-react";

interface NavigationTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabs = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    key: "request",
    label: "Request Leave",
    icon: FileText,
  },
  {
    key: "history",
    label: "Leave History",
    icon: Calendar,
  },
  {
    key: "hours",
    label: "Work Hours",
    icon: Clock,
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    key: "profile",
    label: "Profile",
    icon: User,
  },
];

export default function NavigationTabs({
  activeTab = "dashboard",
  onTabChange,
}: NavigationTabsProps) {
  return (
    <div className="fixed flex gap-2 bg-white shadow-md rounded-full p-1 top-10 ml-20 left-1/2 -translate-x-1/2 z-50 items-center">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange?.(key)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            activeTab === key
              ? "bg-[#B91434] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}