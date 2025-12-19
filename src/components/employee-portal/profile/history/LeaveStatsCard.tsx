import React from "react";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

interface LeaveStatsCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export function LeaveStatsCard({ label, value, icon }: LeaveStatsCardProps) {
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