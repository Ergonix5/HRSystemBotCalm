"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../../../components/ui/badge"
import { Eye } from "lucide-react"

export interface Attendance {
  attendance_id: string
  employee_id: string
  employee_name: string
  date: string
  check_in: string
  check_out: string
  status: "Present" | "Absent" | "Late"
}

export const attendanceColumns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "employee_id",
    header: "Employee ID",
  },
  {
    accessorKey: "employee_name",
    header: "Employee Name",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
  },
  {
    accessorKey: "check_in",
    header: "Check In",
  },
  {
    accessorKey: "check_out",
    header: "Check Out",
  },
 {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.original.status

    const statusStyles = {
      Present: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 ",
      Late: "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200",
      Absent: "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
    }

    return (
      <Badge
        className={`border ${statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-300"}`}
      >
        {status}
      </Badge>
    )
  },
  filterFn: (row, id, value) => {
    if (!value) return true
    return row.getValue(id) === value
  },
}
,
  {
  id: "actions",
  header: "View",
  cell: ({ row }) => {
    const employeeId = row.original.employee_id

    return (
      <button
        onClick={() => console.log("View", employeeId)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Eye className="h-5 w-5" />
      </button>
    )
  },
}
]
