import React, { useState, useMemo } from "react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { LeaveHeader } from "./LeaveHeader";
import { LeaveStatsCard } from "./LeaveStatsCard";
import { LeaveFilters } from "./LeaveFilters";
import { LeaveRecordCard } from "./LeaveRecordCard";
import { LeaveRecord } from "./types";

const leaveHistory: LeaveRecord[] = [
  {
    id: "1",
    type: "Vacation",
    startDate: "Dec 20, 2024",
    endDate: "Dec 25, 2024",
    days: 6,
    status: "approved",
    appliedDate: "Dec 1, 2024",
    reason: "Annual family trip"
  },
  {
    id: "2",
    type: "Sick Leave",
    startDate: "Nov 15, 2024",
    endDate: "Nov 15, 2024",
    days: 1,
    status: "approved",
    appliedDate: "Nov 15, 2024",
    reason: "Doctor appointment"
  },
  {
    id: "3",
    type: "Personal",
    startDate: "Oct 10, 2024",
    endDate: "Oct 12, 2024",
    days: 3,
    status: "pending",
    appliedDate: "Oct 5, 2024",
    reason: "Moving to a new apartment"
  },
  {
    id: "4",
    type: "Vacation",
    startDate: "Sep 5, 2024",
    endDate: "Sep 7, 2024",
    days: 3,
    status: "rejected",
    appliedDate: "Aug 20, 2024",
    reason: "Project deadline conflict"
  }
];

export default function LeaveHistoryTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredHistory = useMemo(() => {
    return leaveHistory.filter(record => {
      const matchesSearch = record.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const stats = {
    total: leaveHistory.reduce((acc, curr) => acc + curr.days, 0),
    approved: leaveHistory.filter(r => r.status === 'approved').reduce((acc, curr) => acc + curr.days, 0),
    pending: leaveHistory.filter(r => r.status === 'pending').length
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white min-h-screen text-slate-900">
      <LeaveHeader />
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <LeaveStatsCard label="Used Days" value={stats.total} icon={<Clock />} />
        <LeaveStatsCard label="Approved Days" value={stats.approved} icon={<CheckCircle2 />} />
        <LeaveStatsCard label="Pending Requests" value={stats.pending} icon={<AlertCircle />} />
      </div>

      <LeaveFilters 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      <div className="space-y-2">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((record) => (
            <LeaveRecordCard key={record.id} record={record} />
          ))
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 text-sm">No records found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}