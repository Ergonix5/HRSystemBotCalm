import React, { useState, useMemo } from "react";
import { Search, Calendar, Clock, CheckCircle2, AlertCircle, MoreVertical, User, Plane, Stethoscope, Briefcase, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

// Types
export interface LeaveRecord {
  id: string;
  type: "Vacation" | "Sick Leave" | "Personal" | "Bereavement";
  startDate: string;
  endDate: string;
  days: number;
  status: "approved" | "pending" | "rejected";
  appliedDate: string;
  reason?: string;
}

// UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
    {children}
  </span>
);

// LeaveHeader Component
function LeaveHeader() {
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

// LeaveStatsCard Component
interface LeaveStatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function LeaveStatsCard({ label, value, icon }: LeaveStatsCardProps) {
  return (
    <Card className="border-slate-200">
      <CardContent className="flex items-center gap-3 py-3">
        <div className="p-1.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
          {React.cloneElement(icon as React.ReactElement<any>, { className: "h-4 w-4" })}
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// LeaveFilters Component
interface LeaveFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

function LeaveFilters({ searchTerm, statusFilter, onSearchChange, onStatusChange }: LeaveFiltersProps) {
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

// LeaveRecordCard Component
interface LeaveRecordCardProps {
  record: LeaveRecord;
}

function getStatusConfig(status: string) {
  switch (status) {
    case "approved":
      return { 
        icon: <CheckCircle2 className="h-3.5 w-3.5" />, 
        label: "Approved",
        colorClass: "bg-slate-900" 
      };
    case "pending":
      return { 
        icon: <AlertCircle className="h-3.5 w-3.5" />, 
        label: "Pending Review",
        colorClass: "bg-slate-400" 
      };
    case "rejected":
      return { 
        icon: <XCircle className="h-3.5 w-3.5" />, 
        label: "Rejected",
        colorClass: "bg-slate-200" 
      };
    default:
      return { 
        icon: null, 
        label: status,
        colorClass: "bg-slate-100" 
      };
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "Vacation": return <Plane className="h-4 w-4" />;
    case "Sick Leave": return <Stethoscope className="h-4 w-4" />;
    case "Personal": return <User className="h-4 w-4" />;
    default: return <Briefcase className="h-4 w-4" />;
  }
}

function LeaveRecordCard({ record }: LeaveRecordCardProps) {
  const status = getStatusConfig(record.status);
  
  return (
    <Card className="group border-slate-200">
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100 shrink-0">
              {getTypeIcon(record.type)}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm">{record.type}</h3>
                <Badge className="flex items-center gap-1 py-0 px-1.5 h-4 text-[9px]">
                  <span className={`w-1 h-1 rounded-full ${status.colorClass}`} />
                  {status.label}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1 font-medium">
                  <Calendar className="h-2.5 w-2.5" />
                  {record.startDate === record.endDate 
                    ? record.startDate 
                    : `${record.startDate} — ${record.endDate}`
                  }
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{record.days} days</span>
                </div>
              </div>
              {record.reason && (
                <p className="text-xs text-slate-400 italic">
                  &ldquo;{record.reason}&rdquo;
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0">
            <div className="text-[9px] uppercase tracking-wider text-slate-400">
              Applied <span className="font-bold text-slate-600">{record.appliedDate}</span>
            </div>
            <button className="p-1 hover:bg-slate-50 rounded text-slate-400 sm:mt-1">
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data
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

// Main LeaveHistory Component
export default function LeaveHistory() {
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