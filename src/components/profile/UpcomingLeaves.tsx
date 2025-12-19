"use client";

import { Card } from "../ui/card";

export default function UpcomingLeaves() {
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