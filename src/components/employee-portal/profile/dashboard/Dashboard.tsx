"use client";

import { Calendar, FileText, Clock, BarChart3 } from "lucide-react";
import { Card } from "../../../ui/card";
import { LucideIcon } from "lucide-react";

// StatsCard Component
interface StatsCardProps {
  icon: LucideIcon;
  current: number;
  total: number;
  label: string;
  value: number;
  unit: string;
  percentage: number;
}

function StatsCard({ icon: Icon, current, total, label, value, unit, percentage }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Icon className="h-8 w-8 text-gray-400" />
        <div>
          <p className="text-sm text-gray-600">{current}/{total}</p>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-[#B91434]">{value}</p>
          <p className="text-sm text-gray-400">{unit}</p>
        </div>
      </div>
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div className="bg-black rounded-full h-2" style={{width: `${percentage}%`}}></div>
      </div>
    </Card>
  );
}

// UpcomingLeaves Component
function UpcomingLeaves() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-2">Upcoming Leaves</h3>
      <p className="text-sm text-gray-500 mb-4">Your approved time off</p>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Vacation</p>
            <p className="text-sm text-gray-500">2024-12-20</p>
          </div>
          <div className="text-right">
            <p className="font-medium">3 days</p>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Approved</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Personal</p>
            <p className="text-sm text-gray-500">2024-12-24</p>
          </div>
          <div className="text-right">
            <p className="font-medium">1 days</p>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Approved</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// RecentActivity Component
function RecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-2">Recent Activity</h3>
      <p className="text-sm text-gray-500 mb-4">Your latest actions</p>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#B91434] rounded-full mt-2"></div>
          <div>
            <p className="font-medium">Leave request approved</p>
            <p className="text-sm text-gray-500">2024-12-10 • Vacation</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#B91434] rounded-full mt-2"></div>
          <div>
            <p className="font-medium">Submitted leave request</p>
            <p className="text-sm text-gray-500">2024-12-08 • Personal</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#B91434] rounded-full mt-2"></div>
          <div>
            <p className="font-medium">Logged 8 hours</p>
            <p className="text-sm text-gray-500">2024-12-05 • Work Hours</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-[#B91434] rounded-full mt-2"></div>
          <div>
            <p className="font-medium">Leave request approved</p>
            <p className="text-sm text-gray-500">2024-12-03 • Sick Leave</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <UpcomingLeaves />
        <RecentActivity />
      </div>
    </>
  );
}