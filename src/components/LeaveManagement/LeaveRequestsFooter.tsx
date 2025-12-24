"use client";

import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function LeaveRequestsFooter({
  total,
  pending,
  approved,
  rejected,
}: {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}) {
  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50 px-6 py-4 shadow-lg">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard 
          label="Total Requests" 
          value={total} 
          gradient="from-gray-100 to-gray-50"
          icon={<FileText className="h-5 w-5" />}
          iconBg="from-black to-gray-800"
        />
        <StatCard 
          label="Pending" 
          value={pending} 
          gradient="from-yellow-50 to-amber-50"
          icon={<Clock className="h-5 w-5" />}
          iconBg="from-yellow-500 to-amber-500"
          textColor="text-yellow-700"
        />
        <StatCard 
          label="Approved" 
          value={approved} 
          gradient="from-green-50 to-emerald-50"
          icon={<CheckCircle className="h-5 w-5" />}
          iconBg="from-green-500 to-emerald-500"
          textColor="text-green-700"
        />
        <StatCard 
          label="Rejected" 
          value={rejected} 
          gradient="from-red-50 to-rose-50"
          icon={<XCircle className="h-5 w-5" />}
          iconBg="from-[#B91434] to-[#8B0F28]"
          textColor="text-[#B91434]"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  gradient,
  icon,
  iconBg,
  textColor = "text-black",
}: {
  label: string;
  value: number;
  gradient: string;
  icon: React.ReactNode;
  iconBg: string;
  textColor?: string;
}) {
  return (
    <div className={`rounded-xl p-4 bg-gradient-to-br ${gradient} border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 group`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${iconBg} shadow-sm text-white`}>
          {icon}
        </div>
        <p className={`text-3xl font-bold ${textColor} group-hover:scale-110 transition-transform duration-200`}>
          {value}
        </p>
      </div>
      <p className="text-xs font-medium text-gray-600 text-left">{label}</p>
    </div>
  );
}