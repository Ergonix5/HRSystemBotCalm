"use client";

import { Avatar, AvatarFallback } from "../../../ui/avatar";
import { Bell } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Employee Portal</h1>
        <p className="text-gray-600">Welcome back, John Doe</p>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        
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