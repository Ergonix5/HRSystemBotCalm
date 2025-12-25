import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Calendar } from "lucide-react";

interface Leave {
  type: string;
  date: string;
  days: number;
  status: string;
}

const leaves: Leave[] = [
  { type: "Vacation", date: "2024-12-20", days: 3, status: "Approved" },
  { type: "Personal", date: "2024-12-24", days: 1, status: "Approved" }
];

export function UpcomingLeaves() {
  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-black tracking-tight">Upcoming Leaves</h3>
            <p className="text-[10px] text-black/40 font-medium uppercase tracking-wider">Your approved time off</p>
          </div>
          <Calendar size={16} className="text-black/10" />
        </div>
        
        <div className="space-y-4">
          {leaves.map((leave, i) => (
            <div key={i} className="flex justify-between items-center pb-4 border-b border-black/3 last:border-0 last:pb-0">
              <div>
                <p className="text-xs font-bold text-black">{leave.type}</p>
                <p className="text-[10px] text-black/40 font-medium">{leave.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-black mb-1">{leave.days} days</p>
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-700 border-green-100">
                  {leave.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}