import { Card, CardContent } from "@/src/components/ui/card";
import { Clock } from "lucide-react";

interface Activity {
  title: string;
  meta: string;
}

const activities: Activity[] = [
  { title: "Leave request approved", meta: "2024-12-10 • Vacation" },
  { title: "Submitted leave request", meta: "2024-12-08 • Personal" },
  { title: "Logged 8 hours", meta: "2024-12-05 • Work Hours" },
  { title: "Leave request approved", meta: "2024-12-03 • Sick Leave" }
];

export function RecentActivity() {
  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-black tracking-tight">Recent Activity</h3>
            <p className="text-[10px] text-black/40 font-medium uppercase tracking-wider">Your latest actions</p>
          </div>
          <Clock size={16} className="text-black/10" />
        </div>
        
        <div className="space-y-5">
          {activities.map((act, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 bg-[#B91434] rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(185,20,52,0.4)]"></div>
              <div>
                <p className="text-xs font-bold text-black leading-none mb-1">{act.title}</p>
                <p className="text-[10px] text-black/40 font-medium">{act.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}