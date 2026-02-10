import React, { useState, useEffect, useMemo } from "react";
import { Card } from "../../../ui/card";
import {
  LeftSidebar,
  RequestForm,
  SuccessScreen,
  type LeaveBalances
} from "./components";
import { useAuth } from "@/src/app/store/authStore";

interface LeaveBalanceData {
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeDescription: string;
  year: number;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
}

export default function RequestLeave() {
  const { user } = useAuth();
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "loading">("loading");
  const [error, setError] = useState("");
  const [balances, setBalances] = useState<LeaveBalances>({});
  const [leaveBalanceData, setLeaveBalanceData] = useState<LeaveBalanceData[]>([]);
  const [leaveTypeMap, setLeaveTypeMap] = useState<Map<string, string>>(new Map());

  // Fetch leave balances on component mount
  useEffect(() => {
    async function fetchLeaveBalances() {
      try {
        setStatus("loading");
        const response = await fetch("/api/employee/leave-balance");
        
        if (!response.ok) {
          throw new Error("Failed to fetch leave balances");
        }

        const data = await response.json();
        
        if (data.success && data.balances && data.balances.length > 0) {
          setLeaveBalanceData(data.balances);
          
          // Convert to balances object for component compatibility
          const balancesObj: LeaveBalances = {};
          const typeMap = new Map<string, string>();
          
          data.balances.forEach((balance: LeaveBalanceData) => {
            balancesObj[balance.leaveTypeName] = balance.remainingDays;
            typeMap.set(balance.leaveTypeName, balance.leaveTypeId);
          });
          
          setBalances(balancesObj);
          setLeaveTypeMap(typeMap);
          
          // Set initial leave type to first available
          const firstLeaveType = data.balances[0]?.leaveTypeName;
          if (firstLeaveType) {
            setSelectedLeaveType(firstLeaveType);
          }
        } else {
          setError("No leave balances found. Please contact HR.");
        }
        
        setStatus("idle");
      } catch (err: any) {
        console.error("Error fetching leave balances:", err);
        setError("Failed to load leave balances. Please try again.");
        setStatus("idle");
      }
    }

    fetchLeaveBalances();
  }, []);

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

  const handleSubmit = async () => {
    if (!startDate || !endDate || error || !selectedLeaveType) return;
    
    if (!user) {
      setError("User not authenticated");
      return;
    }
    
    setStatus("submitting");
    
    try {
      // Get the leave type ID from the map
      const leaveTypeId = leaveTypeMap.get(selectedLeaveType);
      
      if (!leaveTypeId) {
        setError("Invalid leave type selected");
        setStatus("idle");
        return;
      }

      // Convert dates to ISO datetime format
      const startDateTime = new Date(startDate).toISOString();
      const endDateTime = new Date(endDate).toISOString();

      const requestBody = {
        employee: user.id,
        organization: user.organization_id,
        leave_type: leaveTypeId,
        start_date: startDateTime,
        end_date: endDateTime,
        reason: reason || "",
      };

      console.log("Submitting leave request:", requestBody);

      const response = await fetch("/api/LeaveRequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "Failed to submit leave request");
      }

      const result = await response.json();
      console.log("Leave request submitted successfully:", result);
      
      // Update local balances after successful submission
      if (result.success) {
        setBalances(prev => ({
          ...prev,
          [selectedLeaveType]: Math.max(0, prev[selectedLeaveType] - duration)
        }));
      }
      
      setStatus("success");
    } catch (err: any) {
      console.error("Error submitting leave request:", err);
      setError(err.message || "Failed to submit leave request");
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setStartDate("");
    setEndDate("");
    setReason("");
    setError("");
  };

  // Show loading state while fetching balances
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leave balances...</p>
        </Card>
      </div>
    );
  }

  // Show error state if no balances or user not authenticated
  if (!user || Object.keys(balances).length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Unable to Load Leave Balances</h2>
          <p className="text-gray-600 mb-4">
            {!user 
              ? "You must be logged in to request leave." 
              : "No leave balances found. Please contact HR to set up your leave balance."}
          </p>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </Card>
      </div>
    );
  }

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