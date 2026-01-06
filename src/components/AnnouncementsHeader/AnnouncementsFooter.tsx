"use client";

import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function AnnouncementsFooter({
  total,
  highPriority,
  active,
  expiringSoon,
}: {
  total: number;
  highPriority: number;
  active: number;
  expiringSoon: number;
}) {
  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50 px-6 py-4 shadow-lg">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard 
          label="Total" 
          value={total} 
          gradient="from-gray-100 to-gray-50"
          icon={<FileText className="h-5 w-5" />}
          iconBg="from-black to-gray-800"
        />
        <StatCard 
          label="High Priority" 
          value={highPriority} 
          gradient="from-red-50 to-rose-50"
          icon={<AlertCircle className="h-5 w-5" />}
          iconBg="from-[#B91434] to-[#8B0F28]"
          textColor="text-[#B91434]"
        />
        <StatCard 
          label="Active" 
          value={active} 
          gradient="from-green-50 to-emerald-50"
          icon={<CheckCircle className="h-5 w-5" />}
          iconBg="from-green-500 to-emerald-500"
          textColor="text-green-700"
        />
        <StatCard 
          label="Expiring Soon" 
          value={expiringSoon} 
          gradient="from-yellow-50 to-amber-50"
          icon={<Clock className="h-5 w-5" />}
          iconBg="from-yellow-500 to-amber-500"
          textColor="text-yellow-700"
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