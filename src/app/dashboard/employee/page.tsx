
"use client"

import { useState, useEffect } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns  } from "./colomns"
import { type Employee } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { EmployeeDetailsModal } from "../../../components/ViewDetails/employees-details"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import {EmployeeForm} from "../../../components/forms/addEmployee"
import { EditEmployeeForm } from "../../../components/forms/editEmployeeForm"
import { getEmployees } from "@/src/lib/api"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null)

  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const data = await api.employees.getAll()
  //       setEmployeesData(data)
  //     } catch (error) {
  //       console.error('Error fetching employees:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchEmployees()
  // }, [])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await getEmployees()
      setEmployees(data)
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div>Loading employees...</div>
  }


  const handleViewEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.employee_id === employeeId)
    if (employee) {
      setSelectedEmployee(employee)
      setIsModalOpen(true)
    }
  }

  const handleEditEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.employee_id === employeeId)
    if (employee) {
      setEmployeeToEdit(employee)
      setIsEditFormOpen(true)
    }
  }

  return (
    <div className="p-6">
      {/* Topic */}
      

      {/* Employees Table */}

      <div className="border p-5 rounded-md">
        <div className="flex justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl mb-2">Employees Management</h1>
          <p className="text-gray-700">Manage employee information and records</p>
        </div>
<Button
  className="mt-4"
  variant="outline"
  onClick={() => setIsFormOpen(true)} 
>
  <Plus /> Add New Employee
</Button>      </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading employees...</div>
          </div>
        ) : (
          <DataTable
            columns={columns(handleViewEmployee, handleEditEmployee)}
            data={employees}
            filterColumn="name"
            showStatusFilter={true}
            showCompanyFilter={true}
          />
        )}
      </div>

      <EmployeeDetailsModal
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogContent className="max-w-2xl">
                    
                      <EmployeeForm
                        onSubmit={(data) => {
                          console.log('employee data:', data)
                          setIsFormOpen(false)
                        }}
                      />
                    </DialogContent>
                  </Dialog>

      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-2xl">
          {employeeToEdit && (
            <EditEmployeeForm
              employee={employeeToEdit}
              onSubmit={(data) => {
                console.log('Updated employee data:', data)
                setIsEditFormOpen(false)
                setEmployeeToEdit(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>


  )
}
