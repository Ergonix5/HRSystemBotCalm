import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
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

export function StatsCard({ icon: Icon, current, total, label, value, unit, percentage }: StatsCardProps) {
  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-black/3 rounded-lg">
            <Icon className="h-5 w-5 text-[#B91434]" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-black/30 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-2xl font-black text-black leading-none">{value} <span className="text-[10px] text-black/30 font-bold uppercase">{unit}</span></p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold text-black/40 tracking-tight">{current} / {total} Total</p>
            <p className="text-[10px] font-black text-[#B91434]">{percentage}%</p>
          </div>
          <Progress value={percentage} className="h-1.5 bg-black/5" />
        </div>
      </CardContent>
    </Card>
  );
}