"use client";
import { MotionTooltip } from "../ui/motion-tooltip";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  MapPinHouse,
  Shield,
  Users,
  Megaphone,
  Calendar,
  Plane,
  UserCheck,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
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
import { useAuth } from "../../app/store/authStore";

// -------------------- Types --------------------
interface MenuItem {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

// -------------------- Menu Data --------------------
const menuSections: MenuSection[] = [
  {
    label: "Main",
    items: [{ name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }],
  },
  {
    label: "Organization",
    items: [
      { name: "Company", icon: Building2, href: "/dashboard/company" },
      { name: "Designation", icon: MapPinHouse, href: "/dashboard/designation" },
      { name: "Role", icon: Shield, href: "/dashboard/role" },
      { name: "Employees", icon: Users, href: "/dashboard/employee" },
    ],
  },
  {
    label: "HR & Operations",
    items: [
      { name: "Attendance", icon: Calendar, href: "/dashboard/attendance" },
      { name: "Leave Management", icon: Plane, href: "/dashboard/LeaveManagement" },
      { name: "Announcements", icon: Megaphone, href: "/dashboard/announcements" },
      { name: "Report Log", icon: FileText, href: "/dashboard/report-log" },
    ],
  },
  {
    label: "Recruitment",
    items: [{ name: "Interviews", icon: UserCheck, href: "/dashboard/interview" }],
  },
];

// Footer menu
const footerMenu: MenuItem[] = [
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Logout", icon: LogOut, href: "/logout" },
];

// -------------------- Sidebar Component --------------------
export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Collapse sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "4rem" : "16rem"
    );
  }, [isCollapsed]);

  // Logout handler
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Check if a menu item is active
  const isActive = (href: string) => pathname === href;

  return (
    <TooltipProvider>
      <div className="relative">
        {/* Sidebar */}
        <aside
          className={`${
            isCollapsed ? "w-20" : "w-60"
          } h-screen bg-white border-r hidden md:flex flex-col transition-all duration-300 fixed left-0 top-0 z-40`}
        >
          {/* Logo */}
          <div className="flex items-center p-5">
            <Logo className={isCollapsed ? "text-lg" : ""} />
          </div>

          {/* Main Menu */}
          <nav className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
            {menuSections.map((section: MenuSection) => (
              <div key={section.label}>
                {!isCollapsed && (
                  <p className="px-3 py-1 text-[12px] font-semibold text-gray-500 uppercase">
                    {section.label}
                  </p>
                )}

                {section.items.map((item: MenuItem) => {
                  const Icon = item.icon;
                  const activeClass = isActive(item.href)
                        ? "bg-red-100 text-[#B91434] font-semibold"
    : "hover:text-[#B91434] hover:bg-red-50";


                  return isCollapsed ? (
                    <Tooltip key={item.name} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-center h-10 ${activeClass}`}
                          >
                            <Icon size={16} />
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
                        className={`w-full justify-start gap-3 h-10 px-3 ${activeClass}`}
                      >
                        <Icon size={16} />
                        <span className="text-md">{item.name}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer Menu */}
          <div className="p-6 flex flex-col space-y-1">
            {footerMenu.map((item: MenuItem) => {
              const Icon = item.icon;
              const isLogout = item.name === "Logout";
              const href = isLogout ? undefined : item.href;
              const onClick = isLogout ? handleLogout : undefined;
           const activeClass =
  !isLogout && isActive(href!)
    ? "bg-red-100 text-[#B91434] font-semibold"
    : "hover:text-[#B91434] hover:bg-red-50";


              return isCollapsed ? (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {isLogout ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClick}
                        className={`w-full justify-center h-10 ${activeClass}`}
                      >
                        <Icon size={16} />
                      </Button>
                    ) : (
                      <Link href={href!}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-center h-10 ${activeClass}`}
                        >
                          <Icon size={16} />
                        </Button>
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ) : isLogout ? (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  onClick={onClick}
                  className={`w-full justify-start gap-3 h-10 px-3 ${activeClass}`}
                >
                  <Icon size={16} />
                  <span className="text-sm">{item.name}</span>
                </Button>
              ) : (
                <Link key={item.name} href={href!}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-3 h-10 px-3 ${activeClass}`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`fixed ${
            isCollapsed ? "left-12" : "left-60"
          } top-6 z-50 bg-white border shadow-sm rounded-full p-1 h-6 w-6 transition-all duration-300`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>
    </TooltipProvider>
  );
}
