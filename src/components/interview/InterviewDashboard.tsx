"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Users, Calendar, Briefcase, UserCheck, Plus, Clock } from "lucide-react";

interface InterviewDashboardProps {
  onTabChange?: (tab: string) => void;
}

export default function InterviewDashboard({ onTabChange }: InterviewDashboardProps) {
  const stats = [
    { title: "Total Applicants", value: "248", icon: Users },
    { title: "Interviews Today", value: "12", icon: Calendar },
    { title: "Open Job Posts", value: "8", icon: Briefcase },
    { title: "Selected Candidates", value: "34", icon: UserCheck },
  ];

  const recentActivity = [
    { text: "Interview scheduled for N. Perera", time: "2 hours ago" },
    { text: "Candidate selected for SE role", time: "5 hours ago" },
    { text: "New application for UI Designer", time: "1 day ago" },
    { text: "Interview completed for J. Silva", time: "1 day ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                </div>
                <stat.icon className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Applicants Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400">Chart: Applicants per Job</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-[#B91434] hover:bg-[#A01229]" onClick={() => onTabChange?.("jobs")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </Button>
            <Button className="w-full" variant="outline" onClick={() => onTabChange?.("interviews")}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
