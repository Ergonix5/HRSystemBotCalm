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
import { createEmployee } from "../../../lib/api"
import { EditEmployeeForm } from "../../../components/forms/editEmployeeForm"

type Props = {
  employees: Employee[]
}

export function EmployeeTable({ employees }: Props) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null) //viewing a selected employee
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null)// editing a selected employee


   //controlling add edit delete visibility
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)


  //open the view dialog for a specific employee
  const handleViewEmployee = (employeeId: string) => {
    const employee = employees.find(e => e.employee_id === employeeId)
    if (employee) {
      setSelectedEmployee(employee)
      setIsViewOpen(true)
    }
  }

  //open the edit dialog for a specific employee
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
       <div className="space-y-6 mb-10">
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
      <p className="text-gray-500 text-md italic">
        Manage employees information and settings
      </p>
    </div>

    <div className="flex items-center gap-3">
      <div className="relative group">
        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#B91434]" />
        <input 
          type="text" 
          placeholder="Search companies..." 
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#B91434]/20 focus:border-[#B91434] transition-all"
        /> */}
      </div>
      
      <Button 
        variant="outline"
        onClick={() => setIsAddOpen(true)}
        className="border-[#B91434] text-[#B91434] hover:bg-[#B91434] hover:text-white transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Employee
      </Button>
    </div>
  </div>
  <hr className="border-gray-100" />
</div>
      {/* Table */}
      <DataTable
        columns={columns(handleViewEmployee, handleEditEmployee)}
        data={employees}
        filterColumn="name"
        showStatusFilter
        showCompanyFilter
      />

      {/* View employee details  */}
      <EmployeeDetailsModal
        employee={selectedEmployee}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />

      {/* add new employee  */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <EmployeeForm
            onSubmit={async (data) => {
              try {
                await createEmployee(data)
                setIsAddOpen(false)
                // Refresh the page to show new employee
                window.location.reload()
              } catch (error) {
                console.error("Failed to create employee:", error)
                alert("Failed to create employee. Please try again.")
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit employee details */}
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
