"use client";

import { Home, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const menu = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Users", icon: Users, href: "/dashboard/users" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4 hidden md:block">
      <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

      <nav className="space-y-2">
        {menu.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <item.icon size={18} />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
