"use client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Bell } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Employee Portal</h1>
        <p className="text-gray-600">Welcome back, John Doe</p>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="h-5 w-5 text-gray-600" />
        <div className="text-right">
          <p className="text-sm text-gray-600">Employee ID</p>
          <p className="font-medium">EMP-2024-001</p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-[#B91434] text-white">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}