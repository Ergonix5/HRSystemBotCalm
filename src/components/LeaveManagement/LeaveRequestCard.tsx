"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import {
  Building2,
  CalendarDays,
  UserCheck,
  Pencil,
  ChevronDown,
  Clock,
  User,
} from "lucide-react";

interface LeaveRequest {
  name: string;
  employeeId: string;
  leaveId: string;
  leaveType: string;
  duration: string;
  status: "Approved" | "Pending" | "Rejected";
  reason: string;
  company: string;
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  updatedOn?: string;
}

export default function LeaveRequestCard({
  request,
}: {
  request: LeaveRequest;
}) {
  const [open, setOpen] = useState(false);

  const getStatusStyles = () => {
    switch (request.status) {
      case "Approved":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200";
      case "Rejected":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
    }
  };

  return (
    <Card className="p-4 bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-200 hover:border-[#B91434] group">
      {/* Compact Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Name and ID */}
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#B91434] to-[#8B0F28] shadow-sm">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-black text-sm truncate group-hover:text-[#B91434] transition-colors">
                {request.name}
              </h3>
              <p className="text-xs text-gray-500">
                ID: {request.employeeId} · {request.leaveId}
              </p>
            </div>
          </div>

          {/* Inline Info */}
          <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3 text-gray-400" />
              <span>{request.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-gray-400" />
              <span>{request.appliedOn}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="font-medium text-black">{request.duration}</span>
            </div>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()} shadow-sm`}
          >
            {request.status}
          </span>
          <button className="h-7 px-3 text-xs rounded-md hover:bg-[#B91434] hover:text-white transition-colors font-medium flex items-center gap-1 text-gray-700">
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
      </div>

      {/* Leave Type Badge */}
      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 text-xs font-medium text-black shadow-sm">
          {request.leaveType}
        </span>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs font-medium text-[#B91434] hover:text-[#8B0F28] transition-colors"
        >
          {open ? "Less" : "Details"}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Section */}
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3 animate-in slide-in-from-top-2 duration-300">
          {/* Reason */}
          <div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-3">
            <p className="text-xs font-semibold text-black mb-1">Reason</p>
            <p className="text-xs text-gray-700 leading-relaxed">
              {request.reason}
            </p>
          </div>

          {/* Approval Details */}
          {(request.approvedBy || request.approvedOn || request.updatedOn) && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              {request.approvedBy && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <div className="p-1 rounded bg-green-100">
                    <UserCheck className="h-3 w-3 text-green-600" />
                  </div>
                  <span>
                    <span className="font-medium text-black">Approved by:</span>{" "}
                    {request.approvedBy}
                  </span>
                </div>
              )}

              {request.approvedOn && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <CalendarDays className="h-3 w-3 text-gray-400" />
                  <span>
                    <span className="font-medium text-black">Approved:</span>{" "}
                    {request.approvedOn}
                  </span>
                </div>
              )}

              {request.updatedOn && (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span>
                    <span className="font-medium text-black">Updated:</span>{" "}
                    {request.updatedOn}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}