"use client";


import {
  Home,
  Building2,
  Award,
  Shield,
  Users,
  Megaphone,
  Calendar,
  Plane,
  UserCheck,
  FileText,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Logo } from "../ui/logo";
import Link from "next/link";
import { useAuth } from "../../app/store/authStore";
import { useRouter } from "next/navigation";
import { PERMS } from "../../app/config/perms";
import React, { useState, useMemo, useCallback } from "react";


const menu = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  {
    name: "Company",
    icon: Building2,
    href: "/dashboard/company",
    perm: PERMS.COMPANY_VIEW,
  },
  {
    name: "Designation",
    icon: Award,
    href: "/dashboard/designation",
    perm: PERMS.DESIG_VIEW,
  },
  {
    name: "Role",
    icon: Shield,
    href: "/dashboard/role",
    perm: PERMS.ROLE_VIEW,
  },
  {
    name: "Employee",
    icon: Users,
    href: "/dashboard/employee",
    perm: PERMS.EMP_VIEW,
  },
  {
    name: "Announcements",
    icon: Megaphone,
    href: "/dashboard/announcements",
    perm: PERMS.ANN_VIEW,
  },
  {
    name: "Attendance",
    icon: Calendar,
    href: "/dashboard/attendance",
    perm: PERMS.ATT_VIEW,
  },
  {
    name: "Leave Management",
    icon: Plane,
    href: "/dashboard/LeaveManagement",
    perm: PERMS.LEAVE_VIEW,
  },
  {
    name: "Interview",
    icon: UserCheck,
    href: "/dashboard/interview",
    perm: PERMS.INTERVIEW_VIEW,
  },
];


const bottomMenu = [
  {
    name: "Report Log",
    icon: FileText,
    href: "/dashboard/report-log",
    perm: PERMS.LOG_VIEW,
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    perm: PERMS.SYS_SETTINGS,
  },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, has, user, loading } = useAuth();

  // console.log("Auth store state:", useAuth.getState());
  // console.log("User permissions:", useAuth.getState().permissions);
  // console.log("Has employees.view:", has("employees.view"));

  const router = useRouter();



  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const filteredMenu = menu.filter((item) => {
    if (item.perm) return has(item.perm);
    if (item.permAny) return item.permAny.some((perm) => has(perm));
    return true;
  });

  const filteredBottomMenu = bottomMenu.filter((item) => {
    if (item.perm) return has(item.perm);
    if (item.permAny) return item.permAny.some((perm) => has(perm));
    return true;
  });

  // Update CSS custom property for main content margin
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "4rem" : "16rem",
    );
  }, [isCollapsed]);

    // ADD THIS LOADING CHECK HERE
  if (loading || (!user && !loading)) {
    return (
      <TooltipProvider>
        <div className="relative">
          <aside className="w-64 h-screen bg-white border-r shadow-sm hidden md:flex flex-col transition-all duration-300 fixed left-0 top-0 z-40 overflow-hidden">
            <div className="flex items-center p-4 border-b">
              <div>Loading...</div>
            </div>
          </aside>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <aside
          className={`${isCollapsed ? "w-16" : "w-64"} h-screen bg-white border-r shadow-sm hidden md:flex flex-col transition-all duration-300 fixed left-0 top-0 z-40 overflow-hidden`}
        >
          <div className="flex items-center p-4 border-b">
            <Logo className={isCollapsed ? "text-sm" : ""} />
          </div>

          {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-2 top-2 z-10 bg-gray-100 hover:bg-gray-200 border shadow-sm rounded-md p-2 h-8 w-8"
        > */}

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            {filteredMenu.map((item) =>
              isCollapsed ? (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center h-10"
                      >
                        <item.icon size={16} />
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
                    size="sm"
                    className="w-full justify-start gap-3 h-10 px-3"
                  >
                    <item.icon size={16} />
                    <span className="text-sm">{item.name}</span>
                  </Button>
                </Link>
              ),
            )}
          </nav>

          <nav className="p-2 space-y-1 border-t">
            {filteredBottomMenu.map((item) =>
              isCollapsed ? (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center h-10"
                      >
                        <item.icon size={16} />
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
                    size="sm"
                    className="w-full justify-start gap-3 h-10 px-3"
                  >
                    <item.icon size={16} />
                    <span className="text-sm">{item.name}</span>
                  </Button>
                </Link>
              ),
            )}

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {menu.map((item) => (
            isCollapsed ? (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center h-10"
                    >
                      <item.icon size={16} />
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
                  size="sm"
                  className="w-full justify-start gap-3 h-10 px-3"
                >
                  <item.icon size={16} />
                  <span className="text-md">{item.name}</span>
                </Button>
              </Link>
            )
          ))}
        </nav>

        <nav className="p-2 space-y-1 border-t">
          {bottomMenu.map((item) => (
            isCollapsed ? (
              <Tooltip key={item.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-center h-10"
                  >
                    <LogOut size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start gap-3 h-10 px-3"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </Button>
            )}
          </nav>
        </aside>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`fixed ${isCollapsed ? "left-12" : "left-60"} top-6 z-50 bg-white border shadow-sm rounded-full p-1 h-6 w-6 transition-all duration-300`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>
    </TooltipProvider>
  );
}
