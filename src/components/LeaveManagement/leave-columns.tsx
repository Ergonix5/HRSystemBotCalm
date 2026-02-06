"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LeaveActions } from "./leave-actions";

export interface LeaveRequest
{
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

const getStatusStyles = (status: "Approved" | "Pending" | "Rejected") =>
{
    switch (status)
    {
        case "Approved":
            return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:from-green-100 hover:to-emerald-100";
        case "Pending":
            return "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200 hover:from-yellow-100 hover:to-amber-100";
        case "Rejected":
            return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 hover:from-red-100 hover:to-rose-100";
    }
};

export const leaveColumns: ColumnDef<LeaveRequest>[] = [
    {
        accessorKey: "name",
        header: ({ column }) =>
        {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-gray-100"
                >
                    Employee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) =>
        {
            const name = row.getValue("name") as string;
            const employeeId = row.original.employeeId;
            const leaveId = row.original.leaveId;
            return (
                <div className="flex flex-col">
                    <span className="font-semibold text-black">{name}</span>
                    <span className="text-xs text-gray-500">
                        ID: {employeeId} · {leaveId}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) =>
        {
            return (
                <span className="text-sm text-gray-700">{row.getValue("company")}</span>
            );
        },
    },
    {
        accessorKey: "leaveType",
        header: "Leave Type",
        cell: ({ row }) =>
        {
            return (
                <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200 text-black font-medium"
                >
                    {row.getValue("leaveType")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) =>
        {
            return (
                <span className="font-medium text-black">
                    {row.getValue("duration")}
                </span>
            );
        },
    },
    {
        accessorKey: "appliedOn",
        header: ({ column }) =>
        {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-gray-100"
                >
                    Applied On
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) =>
        {
            return (
                <span className="text-sm text-gray-600">
                    {row.getValue("appliedOn")}
                </span>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) =>
        {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-gray-100"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) =>
        {
            const status = row.getValue("status") as "Approved" | "Pending" | "Rejected";
            return (
                <Badge
                    variant="outline"
                    className={`${getStatusStyles(status)} border font-semibold shadow-sm`}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) =>
        {
            const reason = row.getValue("reason") as string;
            return (
                <div className="max-w-[200px]">
                    <p className="text-sm text-gray-700 truncate" title={reason}>
                        {reason}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: "approvedBy",
        header: "Approved By",
        cell: ({ row }) =>
        {
            const approvedBy = row.original.approvedBy;
            const approvedOn = row.original.approvedOn;

            if (!approvedBy)
            {
                return <span className="text-xs text-gray-400">-</span>;
            }

            return (
                <div className="flex flex-col">
                    <span className="text-sm text-gray-700">{approvedBy}</span>
                    {approvedOn && (
                        <span className="text-xs text-gray-500">{approvedOn}</span>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
        {
            const leave = row.original;
            return <LeaveActions leave={leave} />;
        },
    },
];
