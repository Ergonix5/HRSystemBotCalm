"use client"

import { Employee } from "../../app/types/types"
import   { DynamicForm, FormField } from "./reusableform"




interface EditEmployeeFormProps {
  employee: Employee
  onSubmit: (data: any) => void
}

export function EditEmployeeForm({
  employee,
  onSubmit,
}: EditEmployeeFormProps) {
  const fields: FormField[] = [
    {
      id: "employee-id",
      name: "employee_id",
      label: "Employee ID",
      type: "input",
      defaultValue: employee.employee_id,
    },
    {
      id: "first-name",
      name: "first_name",
      label: "First Name",
      type: "input",
      required: true,
      defaultValue: employee.first_name,
    },
    {
      id: "last-name",
      name: "last_name",
      label: "Last Name",
      type: "input",
      required: true,
      defaultValue: employee.last_name,
    },
    {
      id: "email",
      name: "email",
      label: "Email",
      type: "input",
      inputType: "email",
      required: true,
      defaultValue: employee.email,
    },
    {
      id: "phone",
      name: "phone",
      label: "Phone",
      type: "input",
      defaultValue: employee.phone,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: employee.status,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    
  <DynamicForm
      title="Edit Employee"
      description="Update employee details"
      fields={fields}
      mode="edit"
      gridCols={2}
      readOnlyFields={["employee_id"]}
      hiddenFields={{ employee_id: employee.employee_id }}
      submitLabel="Update Employee"
      onSubmit={onSubmit}
/>  
  )
}
