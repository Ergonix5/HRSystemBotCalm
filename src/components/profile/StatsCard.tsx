"use client";

import { Card } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  current: number;
  total: number;
  label: string;
  value: number;
  unit: string;
  percentage: number;
}

export default function StatsCard({ icon: Icon, current, total, label, value, unit, percentage }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Icon className="h-8 w-8 text-gray-400" />
        <div>
          <p className="text-sm text-gray-600">{current}/{total}</p>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-[#B91434]">{value}</p>
          <p className="text-sm text-gray-400">{unit}</p>
        </div>
      </div>
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div className="bg-black rounded-full h-2" style={{width: `${percentage}%`}}></div>
      </div>
    </Card>
  );
}