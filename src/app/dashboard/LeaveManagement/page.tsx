"use client";

import { useEffect, useState } from "react";
import LeaveManagementHeader from "../../../components/LeaveManagement/leavemanagementheader";
import LeaveRequestsFooter from "../../../components/LeaveManagement/LeaveRequestsFooter";
import { DataTable } from "../../../components/table/Data-table";
import { leaveColumns, LeaveRequest } from "../../../components/LeaveManagement/leave-columns";
import { useAuth } from "../../store/authStore";
import RequirePerm from "@/src/components/RequirePerm";
import { PERMS } from "../../config/perms";

const LeaveManagementPage = () =>
{
  const { user, has, hasAny } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLeaveType, setSelectedLeaveType] = useState("all");

  useEffect(() =>
  {
    const fetchLeaveRequests = async () =>
    {
      if (!user?.organization_id) return;

      try
      {
        setLoading(true);

        // Build query params based on user permissions
        let url = `/api/LeaveRequests?limit=100`;

        // Role-based filtering
        if (has && has(PERMS.LEAVE_VIEW_ALL)) {
          // HR/Admin: Can view all organization requests
          // Use selected company or default to user's org
          const orgId = selectedCompany !== "all" ? selectedCompany : user.organization_id;
          url += `&organizationId=${orgId}`;
        } else if (has && has(PERMS.LEAVE_VIEW_TEAM)) {
          // Manager: Can view team requests (for now, show all org)
          url += `&organizationId=${user.organization_id}`;
        } else {
          // Employee: Only own requests (API will filter by employee ID)
          url += `&organizationId=${user.organization_id}`;
        }

        // Add status filter if not "all"
        if (selectedStatus !== "all")
        {
          url += `&status=${selectedStatus}`;
        }

        console.log("Fetching leave requests from:", url);

        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error:", response.status, errorData);
          throw new Error(errorData.message || `Failed to fetch leave requests: ${response.status}`);
        }

        const result = await response.json();

        // Transform API data to match LeaveRequest interface
        const transformedData: LeaveRequest[] = result.data.map((item: any) => ({
          name: `${item.employee?.first_name || ""} ${item.employee?.last_name || ""}`.trim(),
          employeeId: item.employee?.employee_id || "N/A",
          leaveId: item._id,
          leaveType: item.leave_type?.name || "N/A",
          duration: `${item.total_days} ${item.total_days === 1 ? 'day' : 'days'}`,
          status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as "Pending" | "Approved" | "Rejected" | "Cancelled",
          reason: item.reason || "",
          company: item.organization?.name || "N/A",
          appliedOn: new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }),
          approvedBy: item.approver ? `${item.approver.first_name} ${item.approver.last_name}` : undefined,
          approvedOn: item.updated_at !== item.created_at ? new Date(item.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }) : undefined,
        }));

        setLeaveRequests(transformedData);
      } catch (error)
      {
        console.error("Error fetching leave requests:", error);
        // Set empty array on error to prevent UI issues
        setLeaveRequests([]);
      } finally
      {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [user?.organization_id, selectedCompany, selectedStatus, selectedLeaveType]);

  // 🔢 Footer stats calculation
  const total = leaveRequests.length;
  const pending = leaveRequests.filter(l => l.status === "Pending").length;
  const approved = leaveRequests.filter(l => l.status === "Approved").length;
  const rejected = leaveRequests.filter(l => l.status === "Rejected").length;

  return (

    <RequirePerm
      perm={PERMS.LEAVE_VIEW}
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to view leave management.</p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col min-h-screen bg-gray-50 border border-gray-200 rounded-xl overflow-auto">
        {/* Header */}
        <div className="p-6">
          <LeaveManagementHeader
            onCompanyChange={setSelectedCompany}
            onStatusChange={setSelectedStatus}
            onLeaveTypeChange={setSelectedLeaveType}
          />
        </div>

        {/* Data Table */}
        <div className="flex-1 px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading leave requests...</p>
            </div>
          ) : (
            <DataTable
              columns={leaveColumns}
              data={leaveRequests}
              filterColumn="name"
              showStatusFilter={true}
            />
          )}
        </div>

        {/* Sticky Footer */}
        {/* <LeaveRequestsFooter
        total={total}
        pending={pending}
        approved={approved}
        rejected={rejected}
      /> */}
      </div>
    </RequirePerm>
  );
};

export default LeaveManagementPage;

