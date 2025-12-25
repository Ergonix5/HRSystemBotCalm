"use client"

import { useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns } from "./colomns"
import { type Employee } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { EmployeeDetailsModal } from "../../../components/ViewDetails/employees-details"
import { Dialog, DialogContent } from "../../../components/ui/dialog"
import { EmployeeForm } from "../../../components/forms/addEmployee"
import { EditEmployeeForm } from "../../../components/forms/editEmployeeForm"

type Props = {
  employees: Employee[]
}

export function EmployeeTable({ employees }: Props) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null)

  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleViewEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.employee_id === employeeId)
    if (employee) {
      setSelectedEmployee(employee)
      setIsViewOpen(true)
    }
  }

  const handleEditEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.employee_id === employeeId)
    if (employee) {
      setEmployeeToEdit(employee)
      setIsEditOpen(true)
    }
  }

  return (
    <div className="border p-5 rounded-md">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-2">Employees Management</h1>
          <p className="text-gray-700">
            Manage employee information and records
          </p>
        </div>

        <Button variant="outline" onClick={() => setIsAddOpen(true)}>
          <Plus /> Add New Employee
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns(handleViewEmployee, handleEditEmployee)}
        data={employees}
        filterColumn="name"
        showStatusFilter
        showCompanyFilter
      />

      {/* View modal */}
      <EmployeeDetailsModal
        employee={selectedEmployee}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Add modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <EmployeeForm
            onSubmit={(data) => {
              console.log("Employee data:", data)
              setIsAddOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          {employeeToEdit && (
            <EditEmployeeForm
              employee={employeeToEdit}
              onSubmit={(data) => {
                console.log("Updated employee data:", data)
                setIsEditOpen(false)
                setEmployeeToEdit(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
