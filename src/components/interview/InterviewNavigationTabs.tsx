"use client";

import React from "react";
import { BarChart3, UserCircle, UserCheck, Briefcase, FileText } from "lucide-react";

interface InterviewNavigationTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabs = [
  { key: "dashboard", label: "Dashboard", subtitle: "Summary", icon: BarChart3 },
  { key: "candidates", label: "Candidates", subtitle: "Applicants", icon: UserCircle },
  { key: "interviews", label: "Interviews", subtitle: "Interview Process", icon: UserCheck },
  { key: "jobs", label: "Jobs", subtitle: "Job Posts & Hiring", icon: Briefcase },
  { key: "reports", label: "Reports", subtitle: "Analytics", icon: FileText },
];

export default function InterviewNavigationTabs({
  activeTab = "interviews",
  onTabChange,
}: InterviewNavigationTabsProps) {
  return (
    <nav className="flex items-center justify-center bg-white border border-gray-200/60 shadow-sm rounded-2xl p-1.5 gap-1 mb-6">
      {tabs.map(({ key, label, subtitle, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange?.(key)}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeTab === key
              ? "bg-[#B91434] text-white shadow-md scale-105"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <div className="flex flex-col items-start">
            <span className="font-semibold text-sm">{label}</span>
            <span className={`text-[11px] font-normal ${activeTab === key ? "text-white/70" : "text-gray-400"}`}>
              {subtitle}
            </span>
          </div>
        </button>
      ))}
    </nav>
  );
}
