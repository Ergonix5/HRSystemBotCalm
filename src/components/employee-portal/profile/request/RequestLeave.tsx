import React, { useState, useEffect, useMemo } from "react";
import { 
  Send, 
  Briefcase, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CalendarDays, 
  Info, 
  CheckCircle2, 
  ChevronDown,
  Plane,
  Stethoscope,
  User,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

/**
 * UI Components & Helpers
 */
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card = ({ className = "", children }: CardProps) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "brand";
}

const Badge = ({ children, variant = "default" }: BadgeProps) => {
  const styles: Record<string, string> = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    brand: "bg-[#B91434]/10 text-[#B91434]"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

// Custom Dropdown for Leave Type
interface LeaveTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  balances: Record<string, number>;
}

function LeaveTypeSelector({ selectedType, onTypeChange, balances }: LeaveTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const types = [
    { id: "Vacation", icon: Plane, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "Sick Leave", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "Personal", icon: User, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "Other", icon: MoreHorizontal, color: "text-slate-500", bg: "bg-slate-50" },
  ];

  const selectedData = types.find(t => t.id === selectedType) || types[0];

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
        Type of Leave
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 bg-white border-2 border-gray-100 rounded-xl hover:border-[#B91434]/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${selectedData.bg} ${selectedData.color}`}>
            <selectedData.icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-gray-900">{selectedType || "Select Leave"}</div>
            <div className="text-[10px] text-gray-500">{balances[selectedType] || 0} days remaining</div>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                onTypeChange(type.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={`p-2 rounded-lg ${type.bg} ${type.color}`}>
                <type.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-semibold text-gray-900">{type.id}</div>
                <div className="text-xs text-gray-500">{balances[type.id]} days available</div>
              </div>
              {selectedType === type.id && <div className="w-2 h-2 rounded-full bg-[#B91434]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Mini Calendar Preview
interface MiniCalendarProps {
  startDate: string;
  endDate: string;
}

function MiniCalendar({ startDate, endDate }: MiniCalendarProps) {
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

export default function App() {
  const [selectedLeaveType, setSelectedLeaveType] = useState("Vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const balances: Record<string, number> = {
    "Vacation": 12,
    "Sick Leave": 5,
    "Personal": 3,
    "Other": 10
  };

  const duration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  useEffect(() => {
    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        setError("Invalid date range");
      } else if (duration > balances[selectedLeaveType]) {
        setError(`Insufficient ${selectedLeaveType} balance`);
      } else {
        setError("");
      }
    }
  }, [startDate, endDate, selectedLeaveType, duration]);

  const handleSubmit = () => {
    if (!startDate || !endDate || error) return;
    setStatus("submitting");
    setTimeout(() => setStatus("success"), 1800);
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 md:p-6 font-sans">
        <Card className="max-w-md w-full p-6 md:p-10 text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
               <CheckCircle2 className="h-6 w-6 md:h-10 md:w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Request Sent!</h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-6 md:mb-8">
            Your <span className="font-bold text-gray-900">{duration}-day</span> vacation is pending approval from your manager.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 md:p-5 mb-6 md:mb-8 border border-gray-100 space-y-3">
             <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-400">Reference</span>
                <span className="font-mono font-bold text-gray-700">#LR-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
             </div>
             <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-400">Timeline</span>
                <span className="font-bold text-gray-700">{startDate} to {endDate}</span>
             </div>
          </div>
          <button 
            onClick={() => { setStatus("idle"); setStartDate(""); setEndDate(""); }}
            className="w-full py-3 md:py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] text-sm md:text-base"
          >
            Go to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-0 md:p-4 lg:p-8 font-sans">
      <Card className="w-full max-w-5xl h-full md:h-auto flex flex-col md:flex-row shadow-2xl rounded-none md:rounded-2xl">
        
        {/* Left Side: Summary & Policy */}
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
                  <Badge variant="brand">Current Balance</Badge>
                  <div className="mt-2 md:mt-4 flex items-baseline gap-2">
                    <span className="text-4xl md:text-6xl font-black">{balances[selectedLeaveType]}</span>
                    <span className="text-gray-400 font-medium text-xs md:text-sm">Days</span>
                  </div>
                  <p className="text-[10px] md:text-sm text-gray-400 mt-1">Available for {selectedLeaveType}</p>
                </div>
                
                {/* Mobile visualization toggle/indicator could go here, but we'll show mini calendar below */}
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

        {/* Right Side: Form */}
        <div className="flex-1 p-6 md:p-8 lg:p-12 bg-white overflow-y-auto">
          <div className="max-w-md mx-auto">
            <div className="mb-6 md:mb-10 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Create Request</h1>
              <p className="text-gray-500 text-xs md:text-sm">Fill in the details below to request time off.</p>
            </div>

            <div className="space-y-6 md:space-y-8">
              <LeaveTypeSelector 
                selectedType={selectedLeaveType} 
                onTypeChange={setSelectedLeaveType} 
                balances={balances}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date</label>
                  <div className="relative group">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#B91434] outline-none transition-all text-sm font-semibold text-gray-900"
                    />
                    <Calendar className="absolute left-4 top-3 md:top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#B91434] transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date</label>
                  <div className="relative group">
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 rounded-xl focus:bg-white outline-none transition-all text-sm font-semibold text-gray-900 ${
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
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Tell us a bit about your request..."
                  className="w-full p-3 md:p-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#B91434] outline-none transition-all text-sm font-semibold text-gray-900 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
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
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}