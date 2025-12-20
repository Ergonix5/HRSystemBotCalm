
"use client"

import { useState } from "react"
import { DataTable } from "../../../components/table/Data-table"
import { columns  } from "./colomns"
import { type Employee } from "../../types/types"
import { Button } from "../../../components/ui/button"
import { Plus } from "lucide-react"
import { EmployeeDetailsModal } from "../../../components/ViewDetails/employees-details"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import {EmployeeForm} from "../../../components/forms/addEmployee"

// Mock employee data
const employeesData: Employee[] = [
  {
    employee_id: "EMP_001",
    company_id: "COMP_001",
    role_id: "ROLE_001",
    designation_id: "DES_001",
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice@ergonix.com",
    phone: "123-456-7890",
    address: "Colombo, Sri Lanka",
    date_of_birth: "1995-04-12",
    join_date: "2022-01-15",
    status: "Active",
  },
  {
    employee_id: "EMP_002",
    company_id: "COMP_002",
    role_id: "ROLE_002",
    designation_id: "DES_002",
    first_name: "Bob",
    last_name: "Smith",
    email: "bob@techify.com",
    phone: "234-567-8901",
    address: "Kandy, Sri Lanka",
    date_of_birth: "1992-08-21",
    join_date: "2021-03-20",
    status: "Inactive",
  },
  {
    employee_id: "EMP_003",
    company_id: "COMP_003",
    role_id: "ROLE_001",
    designation_id: "DES_003",
    first_name: "Charlie",
    last_name: "Lee",
    email: "charlie@buildpro.com",
    phone: "345-678-9012",
    address: "Galle, Sri Lanka",
    date_of_birth: "1990-02-10",
    join_date: "2020-07-10",
    status: "Active",
  },
  {
    employee_id: "EMP_004",
    company_id: "COMP_004",
    role_id: "ROLE_003",
    designation_id: "DES_004",
    first_name: "Diana",
    last_name: "Green",
    email: "diana@greenleaf.com",
    phone: "456-789-0123",
    address: "Negombo, Sri Lanka",
    date_of_birth: "1988-11-30",
    join_date: "2019-11-05",
    status: "Active",
  }, 
]
export default function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const handleViewEmployee = (employeeId: string) => {
    const employee = employeesData.find(emp => emp.employee_id === employeeId)
    if (employee) {
      setSelectedEmployee(employee)
      setIsModalOpen(true)
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
  onClick={() => setIsFormOpen(true)} // <-- Add this
>
  <Plus /> Add New Employee
</Button>      </div>
        <DataTable
        columns={columns(handleViewEmployee)}
        data={employeesData}
        filterColumn="name"
        showStatusFilter={true}
        showCompanyFilter={true}
      />
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
                        onCancel={() => setIsFormOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
    </div>


  )
}
