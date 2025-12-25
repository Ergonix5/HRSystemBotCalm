import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Calendar, AlertCircle, Clock, Send } from "lucide-react";
import { LeaveTypeSelector } from "./LeaveTypeSelector";
import type { LeaveBalances } from "./types";

interface RequestFormProps {
  selectedLeaveType: string;
  onTypeChange: (type: string) => void;
  balances: LeaveBalances;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  error: string;
  duration: number;
  status: string;
  onSubmit: () => void;
}

export function RequestForm({
  selectedLeaveType,
  onTypeChange,
  balances,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  reason,
  onReasonChange,
  error,
  duration,
  status,
  onSubmit
}: RequestFormProps) {
  return (
    <div className="flex-1 p-6 md:p-8 lg:p-12 bg-white overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="mb-6 md:mb-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Create Request</h1>
          <p className="text-gray-500 text-xs md:text-sm">Fill in the details below to request time off.</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          <LeaveTypeSelector 
            selectedType={selectedLeaveType} 
            onTypeChange={onTypeChange} 
            balances={balances}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date</label>
              <div className="relative group">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#B91434] text-sm font-semibold text-gray-900"
                />
                <Calendar className="absolute left-4 top-3 md:top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#B91434] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date</label>
              <div className="relative group">
                <Input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className={`pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 rounded-xl focus:bg-white text-sm font-semibold text-gray-900 ${
                    error ? 'border-red-100 focus:border-red-500' : 'border-transparent focus:border-[#B91434]'
                  }`}
                />
                <Calendar className="absolute left-4 top-3 md:top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#B91434] transition-colors" />
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          {(error || duration > 0) && (
            <div className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl animate-in slide-in-from-top-2 ${
              error ? "bg-red-50 border border-red-100 text-red-700" : "bg-blue-50 border border-blue-100 text-blue-700"
            }`}>
              {error ? <AlertCircle className="h-4 w-4 md:h-5 md:w-5" /> : <Clock className="h-4 w-4 md:h-5 md:w-5" />}
              <div className="text-xs md:text-sm font-bold">
                {error ? error : `Duration: ${duration} Day${duration !== 1 ? 's' : ''}`}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Reason (Optional)</label>
            <Textarea
              rows={2}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Tell us a bit about your request..."
              className="p-3 md:p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#B91434] text-sm font-semibold text-gray-900 resize-none"
            />
          </div>

          <Button
            onClick={onSubmit}
            disabled={status === "submitting" || !startDate || !endDate || !!error}
            className={`
              w-full py-3.5 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg text-sm md:text-base
              ${(status === "submitting" || !startDate || !endDate || !!error)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-[#B91434] text-white hover:bg-[#8e0f27] hover:shadow-[#B91434]/20 shadow-[#B91434]/30'}
            `}
          >
            {status === "submitting" ? (
              <>
                <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                Submit Request <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}