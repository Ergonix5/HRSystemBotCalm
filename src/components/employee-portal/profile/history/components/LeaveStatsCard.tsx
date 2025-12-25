import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Calendar } from "lucide-react";

interface LeaveStatsCardProps {
  label: string;
  used: number;
  total: number;
}

export function LeaveStatsCard({ label, used, total }: LeaveStatsCardProps) {
  const percentage = (used / total) * 100;
  
  return (
    <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <Calendar className="h-4 w-4 text-black" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{used}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/ {total} days</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
          {total - used} days available
        </p>
        <Progress value={percentage} />
      </CardContent>
    </Card>
  );
}