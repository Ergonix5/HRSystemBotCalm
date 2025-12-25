import { StatsCard } from "./StatsCard";
import { Calendar, Clock, BarChart3, FileText } from "lucide-react";

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard 
        icon={Calendar} current={18} total={25} label="Remaining Leave" 
        value={18} unit="days" percentage={72} 
      />
      <StatsCard 
        icon={Clock} current={32} total={40} label="Weekly Hours" 
        value={32} unit="hours" percentage={80} 
      />
      <StatsCard 
        icon={BarChart3} current={142} total={160} label="Monthly Progress" 
        value={142} unit="hours" percentage={89} 
      />
      <StatsCard 
        icon={FileText} current={5} total={7} label="Approved Apps" 
        value={5} unit="docs" percentage={71} 
      />
    </div>
  );
}