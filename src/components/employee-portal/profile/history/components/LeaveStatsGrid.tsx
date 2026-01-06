import { LeaveStatsCard } from "./LeaveStatsCard";

interface LeaveStat {
  label: string;
  used: number;
  total: number;
}

const leaveStats: LeaveStat[] = [
  { label: 'Annual Leave', used: 12, total: 20 },
  { label: 'Sick Leave', used: 4, total: 10 },
  { label: 'Personal Leave', used: 2, total: 5 },
];

export function LeaveStatsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {leaveStats.map((stat, i) => (
        <LeaveStatsCard key={i} {...stat} />
      ))}
    </div>
  );
}