import React, { useState, useEffect } from "react";
import { Send, Briefcase } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import LeaveTypeSelector from "./LeaveTypeSelector";
import DateRangeSelector from "./DateRangeSelector";
import LeaveBalanceInfo from "./LeaveBalanceInfo";
import SuccessMessage from "./SuccessMessage";
import ReasonInput from "./ReasonInput";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Card = ({ className = "", children }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);



export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <RequestLeaveTab />
    </div>
  );
}

function RequestLeaveTab() {
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
    <Card className="max-w-2xl w-full mx-auto overflow-hidden flex flex-col md:flex-row -mt-96">
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
  );
}