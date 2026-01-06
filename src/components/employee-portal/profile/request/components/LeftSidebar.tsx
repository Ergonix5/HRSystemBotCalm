import { Badge } from "@/src/components/ui/badge";
import { CalendarDays, Info } from "lucide-react";
import { MiniCalendar } from "./MiniCalendar";
import type { LeaveBalances } from "./types";

interface LeftSidebarProps {
  selectedLeaveType: string;
  balances: LeaveBalances;
  startDate: string;
  endDate: string;
}

export function LeftSidebar({ selectedLeaveType, balances, startDate, endDate }: LeftSidebarProps) {
  return (
    <div className="w-full md:w-1/3 bg-gray-900 p-6 md:p-8 text-white relative flex flex-col justify-between overflow-hidden">
      {/* Decorative background shape */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B91434] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl hidden md:block" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#B91434] rounded-lg md:rounded-xl flex items-center justify-center">
            <CalendarDays className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <span className="font-black text-lg md:text-xl tracking-tight">Request Leave Forum<span className="text-[#B91434]">.</span></span>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="flex md:block items-center justify-between md:justify-start">
            <div>
              <Badge className="bg-[#B91434]/10 text-[#B91434]">Current Balance</Badge>
              <div className="mt-2 md:mt-4 flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-black">{balances[selectedLeaveType]}</span>
                <span className="text-gray-400 font-medium text-xs md:text-sm">Days</span>
              </div>
              <p className="text-[10px] md:text-sm text-gray-400 mt-1">Available for {selectedLeaveType}</p>
            </div>
          </div>

          <div className="pt-4 md:pt-8 border-t border-gray-800 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-amber-500/20 rounded">
                <Info className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
              </div>
              <div className="text-[10px] md:text-xs text-gray-400 leading-relaxed">
                <span className="font-bold text-white block mb-0.5 md:mb-1 uppercase tracking-tighter">Policy Alert</span>
                Requests for more than 5 days must be submitted 2 weeks in advance.
              </div>
            </div>
          </div>

          {/* Visualization - Hidden on small mobile to save space, or scaled */}
          <div className="pt-2 md:pt-4 hidden sm:block">
            <MiniCalendar startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 md:mt-12 text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        System Status: Optimal
      </div>
    </div>
  );
}