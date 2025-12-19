"use client";

import { Card } from "../ui/card";

export default function RecentActivity() {
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