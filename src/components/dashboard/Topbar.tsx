"use client";

import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LiveClock } from "../ui/live-clock";

export default function Topbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <Input
        type="text"
        placeholder="Search..."
        className="w-64"
      />

      <div className="flex items-center gap-4">
        <LiveClock />
        <Avatar>
          <AvatarFallback>NS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}