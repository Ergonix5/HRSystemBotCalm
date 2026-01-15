"use client";

import { useState } from "react";
import InterviewNavigationTabs from "@/src/components/interview/InterviewNavigationTabs";
import InterviewDashboard from "@/src/components/interview/InterviewDashboard";

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <InterviewDashboard onTabChange={setActiveTab} />;
      case "candidates":
        return <div className="p-6 bg-white rounded-lg shadow">Candidates - Applicants</div>;
      case "interviews":
        return <div className="p-6 bg-white rounded-lg shadow">Interviews - Interview Process</div>;
      case "jobs":
        return <div className="p-6 bg-white rounded-lg shadow">Jobs - Job Posts & Hiring</div>;
      case "reports":
        return <div className="p-6 bg-white rounded-lg shadow">Reports - Analytics</div>;
      default:
        return <InterviewDashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Recruitment Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage candidates, interviews, and hiring process</p>
        </div>
        <InterviewNavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-8">{renderTabContent()}</div>
      </div>
    </div>
  );
}
