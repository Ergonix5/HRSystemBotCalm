"use client"

import { useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns } from "./colomns"
import { type Employee } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { EmployeeDetailsModal } from "../../../components/ViewDetails/employees-details"
import { AddEmployeeForm } from "../../../components/forms/addEmployee"
import { createEmployee, updateEmployee, deleteEmployee } from "../../../services/employee.service"
import { EditEmployeeForm } from "../../../components/forms/editEmployeeForm"
import { PermissionCheck } from "../../../components/PermissionCheck";

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

  //delete a specific employee
  const handleDeleteEmployee = async (employeeId: string) => {
    const employee = employees.find(e => e.employee_id === employeeId)
    if (!employee) return

    if (window.confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      try {
        await deleteEmployee(employee._id)
        window.location.reload()
      } catch (error) {
        console.error("Failed to delete employee:", error)
        alert("Failed to delete employee. Please try again.")
      }
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
      
    <PermissionCheck permission="employees.create">

           <Button 
        variant="outline"
        onClick={() => setIsAddOpen(true)}
        className="border-[#B91434] text-[#B91434] hover:bg-[#B91434] hover:text-white transition-colors"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Employee
      </Button>

    </PermissionCheck>
     
    </div>
  </div>
  <hr className="border-gray-100" />
</div>
      {/* Table */}
      <DataTable
        columns={columns(handleViewEmployee, handleEditEmployee, handleDeleteEmployee)}
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
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <AddEmployeeForm
            onSubmit={async (data: Employee) => {
              try {
                await createEmployee(data)
                setIsAddOpen(false)
                window.location.reload()
              } catch (error) {
                console.error("Failed to create employee:", error)
                alert("Failed to create employee. Please try again.")
              }
            }}
            onClose={() => setIsAddOpen(false)}
          />
        </div>
      )}

      {/* Edit employee details */}
      {isEditOpen && employeeToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <EditEmployeeForm
            employee={employeeToEdit}
            onSubmit={async (data) => {
              try {
                await updateEmployee(employeeToEdit._id, data)
                setIsEditOpen(false)
                setEmployeeToEdit(null)
                window.location.reload()
              } catch (error) {
                console.error("Failed to update employee:", error)
                alert("Failed to update employee. Please try again.")
              }
            }}
            onClose={() => setIsEditOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
