import React from "react";
import { Calendar, Clock, MoreVertical, User, Plane, Stethoscope, Briefcase, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

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

interface LeaveRecord {
  id: string;
  type: "Vacation" | "Sick Leave" | "Personal" | "Bereavement";
  startDate: string;
  endDate: string;
  days: number;
  status: "approved" | "pending" | "rejected";
  appliedDate: string;
  reason?: string;
}

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

export function LeaveRecordCard({ record }: LeaveRecordCardProps) {
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