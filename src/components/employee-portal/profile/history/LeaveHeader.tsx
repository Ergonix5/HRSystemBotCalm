import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function LeaveHeader() {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Leave Management</h1>
        <p className="text-slate-500 text-sm">View and manage your historical time-off requests.</p>
      </div>
      <Button variant="custom" className="px-3 py-1.5 rounded-lg font-medium shadow-sm flex items-center gap-2 w-fit text-sm">
        <Calendar className="h-4 w-4" />
        Request Leave
      </Button>
    </div>
  );
}