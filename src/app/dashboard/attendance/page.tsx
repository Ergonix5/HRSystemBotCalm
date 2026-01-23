"use client"

import { useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { attendanceColumns, Attendance } from './columns';
import { Input } from "../../../components/ui/input"
import { Employee } from '../../../components/employee-portal/profile/profile/components/types';
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
const attendanceData: Attendance[] = [
  {
    attendance_id: "ATT001",
    employee_id: "EMP001",
    employee_name: "Kamal Perera",
    date: "2026-01-20",
    check_in: "09:05 AM",
    check_out: "05:30 PM",
    status: "Late",
  },
  {
    attendance_id: "ATT002",
    employee_id: "EMP002",
    employee_name: "Nimal Silva",
    date: "2026-01-20",
    check_in: "08:55 AM",
    check_out: "05:15 PM",
    status: "Present",
  },
  {
    attendance_id: "ATT003",
    employee_id: "EMP003",
    employee_name: "Saman Fernando",
    date: "2026-01-21",
    check_in: "-",
    check_out: "-",
    status: "Absent",
  },
]

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>("")

  // Filter data by selected date
  const filteredData = attendanceData.filter((row) => {
    if (!selectedDate) return true
    return row.date === selectedDate
  })

  return (
    <div className="border  p-5 rounded-md">
          <div className="space-y-6 mb-10">
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
      <p className="text-gray-500 text-md italic">
        Track Employee Attendance Records
      </p>
    </div>

    <div className="flex items-center gap-3">
      
     {/* Single date picker */}

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
  
  </div>
  <hr className="border-gray-100" />
</div>

      

      <DataTable
        columns={attendanceColumns}
        data={filteredData}
        filterColumn="employee_name"
        showStatusFilter={true}
      />
    </div>
  )
}
