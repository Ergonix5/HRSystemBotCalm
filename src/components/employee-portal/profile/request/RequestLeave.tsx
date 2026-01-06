import React, { useState, useEffect, useMemo } from "react";
import { Card } from "../../../ui/card";
import {
  LeftSidebar,
  RequestForm,
  SuccessScreen,
  type LeaveBalances
} from "./components";

export default function RequestLeave() {
  const [selectedLeaveType, setSelectedLeaveType] = useState("Vacation");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const balances: LeaveBalances = {
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

  const handleReset = () => {
    setStatus("idle");
    setStartDate("");
    setEndDate("");
  };

  if (status === "success") {
    return (
      <SuccessScreen 
        duration={duration}
        startDate={startDate}
        endDate={endDate}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-0 md:p-4 lg:p-8 font-sans">
      <Card className="w-full max-w-5xl h-full md:h-auto flex flex-col md:flex-row shadow-2xl rounded-none md:rounded-2xl">
        <LeftSidebar 
          selectedLeaveType={selectedLeaveType}
          balances={balances}
          startDate={startDate}
          endDate={endDate}
        />
        <RequestForm 
          selectedLeaveType={selectedLeaveType}
          onTypeChange={setSelectedLeaveType}
          balances={balances}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          reason={reason}
          onReasonChange={setReason}
          error={error}
          duration={duration}
          status={status}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}