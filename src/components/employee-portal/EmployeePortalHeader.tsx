"use client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Bell } from "lucide-react";
import { useUser } from "@/src/contexts/UserContext";

export default function ProfileHeader() {
  const { user, loading } = useUser();
  
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Employee Portal</h1>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Employee ID</p>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Employee Portal</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Employee ID</p>
          <p className="font-medium">{user?.employeeId}</p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-[#B91434] text-white">
            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}