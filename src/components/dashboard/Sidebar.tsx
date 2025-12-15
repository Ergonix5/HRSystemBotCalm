"use client";

import { useState } from "react";
import { Home, Building2, Award, Shield, Users, Megaphone, Calendar, Plane, UserCheck, FileText, Settings, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Logo } from "../ui/logo";
import Link from "next/link";

const menu = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Company", icon: Building2, href: "/dashboard/company" },
  { name: "Designation", icon: Award, href: "/dashboard/designation" },
  { name: "Role", icon: Shield, href: "/dashboard/role" },
  { name: "Employee", icon: Users, href: "/dashboard/employee" },
  { name: "Announcements", icon: Megaphone, href: "/dashboard/announcements" },
  { name: "Attendance", icon: Calendar, href: "/dashboard/attendance" },
  { name: "Leave Management", icon: Plane, href: "/dashboard/leave-management" },
  { name: "Interview", icon: UserCheck, href: "/dashboard/interview" },
];

const bottomMenu = [
  { name: "Report Log", icon: FileText, href: "/dashboard/report-log" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <TooltipProvider>
      <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r shadow-sm p-4 hidden md:flex flex-col transition-all duration-300 relative`}>
        <div className="flex items-center mb-6">
          <Logo className={isCollapsed ? "text-sm" : ""} />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 z-10 bg-white border shadow-sm rounded-full p-1 h-6 w-6"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>

        <nav className="space-y-2 flex-1">
          {menu.map((item) => (
            isCollapsed ? (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-center px-2"
                    >
                      <item.icon size={18} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <item.icon size={18} />
                  {item.name}
                </Button>
              </Link>
            )
          ))}
        </nav>

        <nav className="space-y-2 mt-6 pt-4 border-t">
          {bottomMenu.map((item) => (
            isCollapsed ? (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-center px-2"
                    >
                      <item.icon size={18} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <item.icon size={18} />
                  {item.name}
                </Button>
              </Link>
            )
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}