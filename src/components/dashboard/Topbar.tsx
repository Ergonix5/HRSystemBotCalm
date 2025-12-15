"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Topbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <Input
        type="text"
        placeholder="Search..."
        className="w-64"
      />

      <Avatar>
        <AvatarFallback>NS</AvatarFallback>
      </Avatar>
    </header>
  );
}
