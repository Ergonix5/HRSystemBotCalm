import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  startDate: string;
  endDate: string;
}

export function MiniCalendar({ startDate, endDate }: MiniCalendarProps) {
  const today = new Date();
  
  const days = useMemo(() => {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysArr: (Date | null)[] = [];
    
    // Padding for start of week
    for (let i = 0; i < startOfMonth.getDay(); i++) daysArr.push(null);
    
    for (let i = 1; i <= lastOfMonth.getDate(); i++) {
      daysArr.push(new Date(today.getFullYear(), today.getMonth(), i));
    }
    return daysArr;
  }, []);

  const isSelected = (date: Date | null) => {
    if (!date || !startDate || !endDate) return false;
    const d = date.getTime();
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    return d >= s && d <= e;
  };

  const isToday = (date: Date | null) => date && date.toDateString() === today.toDateString();

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-900">
          {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <ChevronLeft className="h-4 w-4 text-gray-400" />
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-gray-400 mb-2">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          const selected = isSelected(date);
          return (
            <div
              key={i}
              className={`
                h-7 flex items-center justify-center rounded-md text-xs transition-all
                ${!date ? '' : 'cursor-default'}
                ${selected ? 'bg-[#B91434] text-white font-bold' : 'text-gray-600'}
                ${isToday(date) && !selected ? 'border border-[#B91434] text-[#B91434]' : ''}
              `}
            >
              {date?.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}