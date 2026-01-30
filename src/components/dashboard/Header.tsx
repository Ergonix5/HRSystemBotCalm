"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(now.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-end gap-4 px-6 py-3 border-b  bg-gray-50">
      <span className="text-sm text-muted-foreground">{dateTime}</span>
      <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
    </header>
  );
}
