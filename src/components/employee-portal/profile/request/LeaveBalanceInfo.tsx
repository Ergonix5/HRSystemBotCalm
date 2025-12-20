import { CalendarDays, Info } from "lucide-react";

interface LeaveBalanceInfoProps {
  selectedLeaveType: string;
  balance: number;
}

export default function LeaveBalanceInfo({ selectedLeaveType, balance }: LeaveBalanceInfoProps) {
  return (
    <div className="bg-black p-8 text-white md:w-1/3 flex flex-col justify-between">
      <div>
        <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
          <CalendarDays className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2">Time Off</h2>
        <p className="text-gray-400 text-sm mb-8">Manage your leave requests and check your balances.</p>
        
        <div className="space-y-6">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">Current Balance</p>
            <div className="text-3xl font-bold text-white mb-1">
              {balance} <span className="text-sm font-normal text-gray-400">days</span>
            </div>
            <p className="text-sm text-gray-400">Available for {selectedLeaveType}</p>
          </div>
          
          <div className="pt-6 border-t border-gray-800">
            <div className="flex items-center gap-2 text-sm text-yellow-500 mb-2">
              <Info className="h-4 w-4" />
              <span>Policy Note</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Requests longer than 5 days require manager approval at least 2 weeks in advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}