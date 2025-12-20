import { Calendar, FileText, Clock, BarChart3 } from "lucide-react";
import StatsCard from "../dashboard/StatsCard";
import UpcomingLeaves from "./UpcomingLeaves";
import RecentActivity from "./RecentActivity";

export default function DashboardTab() {
  return (
    <>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={Calendar}
          current={18}
          total={25}
          label="Remaining Leave Days"
          value={18}
          unit="days"
          percentage={72}
        />
        <StatsCard 
          icon={Clock}
          current={32}
          total={40}
          label="Hours This Week"
          value={32}
          unit="hours"
          percentage={80}
        />
        <StatsCard 
          icon={BarChart3}
          current={142}
          total={160}
          label="Hours This Month"
          value={142}
          unit="hours"
          percentage={89}
        />
        <StatsCard 
          icon={FileText}
          current={5}
          total={7}
          label="Approved Leaves"
          value={5}
          unit="leaves"
          percentage={71}
        />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <UpcomingLeaves />
        <RecentActivity />
      </div>
    </>
  );
}