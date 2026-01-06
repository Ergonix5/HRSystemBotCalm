"use client"

import { Employee } from "../../app/types/types"
import { DynamicForm} from "./reusableform"
import { type FormField } from '@/src/app/types/types';
export function EmployeeForm({
  employee,
  onSubmit,
}: {
  employee?: Employee
  onSubmit: (data: any) => void
}) {
  const fields: FormField[] = [
    { id: "organization", name: "organization", label: "Organization ID", type: "input", required: true, defaultValue: employee?.organization || "674b8b8b123456789abcdef0" },
    { id: "designation", name: "designation", label: "Designation ID", type: "input", required: true, defaultValue: employee?.designation || "674b8b8b123456789abcdef1" },
    { id: "role", name: "role", label: "Role ID", type: "input", required: true, defaultValue: employee?.role || "674b8b8b123456789abcdef2" },
    { id: "employee-id", name: "employee_id", label: "Employee ID", type: "input", required: true, defaultValue: employee?.employee_id },
    { id: "first-name", name: "first_name", label: "First Name", type: "input", required: true, defaultValue: employee?.first_name },
    { id: "last-name", name: "last_name", label: "Last Name", type: "input", required: true, defaultValue: employee?.last_name },
    { id: "email", name: "email", label: "Email", type: "input", required: true, defaultValue: employee?.email },
    { id: "phone", name: "phone", label: "Phone", type: "input", required: true, defaultValue: employee?.phone },
    { id: "address", name: "address", label: "Address", type: "textarea", defaultValue: employee?.address },
    { id: "dob", name: "date_of_birth", label: "Date of Birth", type: "input", inputType: "date", defaultValue: employee?.date_of_birth },
    { id: "join-date", name: "join_date", label: "Join Date", type: "input", inputType: "date", defaultValue: employee?.join_date },
    { id: "status", name: "employment_status", label: "Status", type: "select", defaultValue: employee?.employment_status, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
  ]

  return (
    <DynamicForm
      title={employee ? "Edit Employee" : "Add New Employee"}
      description="Enter employee details below."
      fields={fields}
      onSubmit={onSubmit}
      gridCols={2}
    />
  )
}
