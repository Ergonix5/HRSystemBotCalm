"use client";

import LeaveManagementHeader from "../../../components/LeaveManagement/leavemanagementheader";
import LeaveRequestCard from "../../../components/LeaveManagement/LeaveRequestCard";
import LeaveRequestsFooter from "../../../components/LeaveManagement/LeaveRequestsFooter";

const LeaveManagementPage = () => {
  // Sample leave requests
  const leaveRequests = [
    {
      name: "John Doe",
      employeeId: "EMP001",
      leaveId: "LV001",
      leaveType: "Sick Leave",
      duration: "3 days",
      status: "Approved" as const,
      reason: "Suffering from fever and need rest",
      company: "Tech Solutions Inc",
      appliedOn: "Dec 10, 2024",
      approvedBy: "John Manager",
      approvedOn: "Dec 11, 2024",
    },
    {
      name: "Jane Smith",
      employeeId: "EMP002",
      leaveId: "LV002",
      leaveType: "Annual Leave",
      duration: "8 days",
      status: "Pending" as const,
      reason: "Family vacation during Christmas holidays",
      company: "Tech Solutions Inc",
      appliedOn: "Dec 8, 2024",
      approvedBy: undefined,
      approvedOn: undefined,
    },
    {
      name: "Mike Johnson",
      employeeId: "EMP003",
      leaveId: "LV003",
      leaveType: "Personal Leave",
      duration: "2 days",
      status: "Rejected" as const,
      reason: "Personal matters",
      company: "Tech Solutions Inc",
      appliedOn: "Dec 5, 2024",
      approvedBy: "HR Manager",
      approvedOn: "Dec 6, 2024",
    },
  ];

  // 🔢 Footer stats calculation
  const total = leaveRequests.length;
  const pending = leaveRequests.filter(l => l.status === "Pending").length;
  const approved = leaveRequests.filter(l => l.status === "Approved").length;
  const rejected = leaveRequests.filter(l => l.status === "Rejected").length;

  return (
    <div className="flex flex-col h-screen bg-gray-50 border  border-gray-200 rounded-xl ">
      {/* Header */}
      <div className="p-6">
        <LeaveManagementHeader />
      </div>

      {/* Scrollable Leave List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4">
        {leaveRequests.map((request, index) => (
          <LeaveRequestCard key={index} request={request} />
        ))}
      </div>

      {/* Sticky Footer */}
      <LeaveRequestsFooter
        total={total}
        pending={pending}
        approved={approved}
        rejected={rejected}
      />
    </div>
  );
};

export default LeaveManagementPage;
