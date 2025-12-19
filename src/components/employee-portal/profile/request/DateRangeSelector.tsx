import { Calendar, Clock, AlertCircle } from "lucide-react";

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error: string;
  duration: number;
}

export default function DateRangeSelector({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  error, 
  duration 
}: DateRangeSelectorProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B91434]/20 focus:border-[#B91434] outline-none transition-all text-sm text-gray-900"
            />
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 outline-none transition-all text-sm text-gray-900 ${
                error ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-[#B91434]/20 focus:border-[#B91434]"
              }`}
            />
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {(error || duration > 0) && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          error ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"
        }`}>
          {error ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
          <span className="font-medium">
            {error ? error : `Total Duration: ${duration} day${duration !== 1 ? 's' : ''}`}
          </span>
        </div>
      )}
    </>
  );
}