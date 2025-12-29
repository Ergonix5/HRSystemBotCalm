import { Progress } from '@/src/components/ui/progress';

interface WeeklyProgressProps {
  totalHours: number;
  targetHours: number;
}

export default function WeeklyProgress({ totalHours, targetHours }: WeeklyProgressProps) {
  const progressPercentage = Math.min(100, (totalHours / targetHours) * 100);

  return (
    <div className="bg-white p-6 rounded-lg border border-[#F0F0F0] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#717171]">Weekly Progress</h3>
        <span className="text-[13px] font-bold text-[#B91434]">{progressPercentage.toFixed(0)}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}