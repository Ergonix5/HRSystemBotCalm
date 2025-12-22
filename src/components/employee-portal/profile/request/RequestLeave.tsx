import React, { useState, useEffect } from "react";
import { Send, Briefcase, Calendar, Clock, AlertCircle, CalendarDays, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

// UI Components
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card = ({ className = "", children }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

// LeaveTypeSelector Component
interface LeaveTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

function LeaveTypeSelector({ selectedType, onTypeChange }: LeaveTypeSelectorProps) {
  const leaveTypes = ["Vacation", "Sick Leave", "Personal", "Other"];

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Leave Type</label>
      <div className="grid grid-cols-2 gap-3">
        {leaveTypes.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
              selectedType === type
                ? "border-[#B91434] bg-[#B91434]/5 ring-1 ring-[#B91434]"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              type === selectedType ? "bg-[#B91434]" : "bg-gray-300"
            }`}></div>
            <span className={`text-sm font-medium ${
              selectedType === type ? "text-[#B91434]" : "text-gray-700"
            }`}>{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// DateRangeSelector Component
interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  error: string;
  duration: number;
}

function DateRangeSelector({ 
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

// LeaveBalanceInfo Component
interface LeaveBalanceInfoProps {
  selectedLeaveType: string;
  balance: number;
}

function LeaveBalanceInfo({ selectedLeaveType, balance }: LeaveBalanceInfoProps) {
  return (
    <div className="bg-gray-900 p-8 text-white md:w-1/3 flex flex-col justify-between">
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
      
      <div className="mt-8 md:mt-0 text-xs text-gray-500">
        Internal HR Portal v2.4
      </div>
    </div>
  );
}

// ReasonInput Component
interface ReasonInputProps {
  value: string;
  onChange: (value: string) => void;
}

function ReasonInput({ value, onChange }: ReasonInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reason (Optional)</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Annual family trip..."
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B91434]/20 focus:border-[#B91434] outline-none transition-all text-sm resize-none"
      ></textarea>
    </div>
  );
}

// SuccessMessage Component
interface SuccessMessageProps {
  duration: number;
  selectedLeaveType: string;
  startDate: string;
  endDate: string;
  onReset: () => void;
}

function SuccessMessage({
  duration,
  selectedLeaveType,
  startDate,
  endDate,
  onReset,
}: SuccessMessageProps) {
  return (
    <div className="flex justify-center mt-16 px-4">
      <Card className="max-w-xl w-full p-8 text-center animate-in fade-in zoom-in duration-300 -mt-90">
        
        {/* Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Request Submitted!
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Your request for <strong>{duration} days</strong> of{" "}
          <strong>{selectedLeaveType}</strong> has been sent to your manager for
          approval.
        </p>

        {/* Details Card */}
        <div className="bg-gray-50 p-5 rounded-xl text-left mb-8 border border-gray-200">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-500">Dates</span>
            <span className="font-medium text-gray-900 text-sm">
              {startDate} → {endDate}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Leave Type</span>
            <span className="font-medium text-gray-900 text-sm">
              {selectedLeaveType}
            </span>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="custom" 
          onClick={onReset} 
          className="w-full py-3 rounded-xl text-sm"
        >
          Submit Another Request
        </Button>
      </Card>
    </div>
  );
}

// Main RequestLeave Component
export default function RequestLeave() {
  const [selectedLeaveType, setSelectedLeaveType] = useState("Vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  // Mock data for leave balances
  const balances: Record<string, number> = {
    "Vacation": 12,
    "Sick Leave": 5,
    "Personal": 3,
    "Other": 0
  };

  // Calculate duration when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        setError("End date cannot be before start date");
        setDuration(0);
      } else {
        setError("");
        // Calculate difference in days (inclusive)
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDuration(diffDays);
      }
    } else {
      setDuration(0);
      setError("");
    }
  }, [startDate, endDate]);

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError("Please select both dates");
      return;
    }
    if (error) return;

    setStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  const handleReset = () => {
    setStatus("idle");
    setStartDate("");
    setEndDate("");
    setReason("");
    setDuration(0);
    setError("");
  };

  if (status === "success") {
    return (
      <SuccessMessage 
        duration={duration}
        selectedLeaveType={selectedLeaveType}
        startDate={startDate}
        endDate={endDate}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <Card className="max-w-2xl w-full mx-auto overflow-hidden flex flex-col md:flex-row">
        <LeaveBalanceInfo 
          selectedLeaveType={selectedLeaveType}
          balance={balances[selectedLeaveType]}
        />

        {/* Main Form Area */}
        <div className="p-8 md:w-2/3 bg-white">
          <div className="flex items-center gap-3 mb-8">
             <div className="bg-[#B91434]/10 p-2 rounded-lg">
               <Briefcase className="h-5 w-5 text-[#B91434]" />
             </div>
             <h3 className="text-lg font-semibold text-gray-900">New Request</h3>
          </div>

          <div className="space-y-6">
            <LeaveTypeSelector 
              selectedType={selectedLeaveType}
              onTypeChange={setSelectedLeaveType}
            />

            <DateRangeSelector 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              error={error}
              duration={duration}
            />

            <ReasonInput 
              value={reason}
              onChange={setReason}
            />

            <Button 
              variant="custom"
              onClick={handleSubmit}
              disabled={status === "submitting" || !!error}
              className="w-full py-3 rounded-lg"
            >
              {status === "submitting" ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit Request <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}