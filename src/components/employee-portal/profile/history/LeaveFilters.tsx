import React from "react";
import { Search } from "lucide-react";

interface LeaveFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function LeaveFilters({ searchTerm, statusFilter, onSearchChange, onStatusChange }: LeaveFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search history..."
          className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 bg-slate-50/50 text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select 
        className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50/50 text-sm focus:outline-none focus:border-slate-400 outline-none"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
}