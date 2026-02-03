"use client"

import { DynamicForm } from "./reusableform"
import { employeeCreateSchema } from "../../validators/employee.schema"
import { UserPlus } from "lucide-react"
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { Button } from "../../components/ui/button"
import { format } from "date-fns"

interface EditEmployeeFormProps {
  employee: any
  onSubmit: (data: any) => void
  onClose: () => void
}

/* ---------------- Date Picker Field ---------------- */
function DateField({ value, onChange }: any) {
  const selectedDate =
    value instanceof Date ? value : value ? new Date(value) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onChange}   
          captionLayout="dropdown"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

/* ---------------- Edit Employee Form ---------------- */
export function EditEmployeeForm({
  employee,
  onSubmit,
  onClose,
}: EditEmployeeFormProps) {
  return (
    <DynamicForm
      title="Edit Employee"
      description="Update employee details"
      icon={<UserPlus size={20} />}
      schema={employeeCreateSchema}
      onSubmit={onSubmit}
      onClose={onClose}
      submitLabel="Update Employee"
      gridCols={1}
      defaultValues={{
        employee_id: employee.employee_id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        address: employee.address,
        email: employee.email,
        phone: employee.phone,
        date_of_birth: employee.date_of_birth,
        company_id: employee.company_id,
        designation_id: employee.designation_id,
        role_id: employee.role_id,
        join_date: employee.join_date,
        employment_status: employee.employment_status,
      }}
      fieldGroups={[
        {
          title: "Personal Details",
          fields: [
            { id: "employee_id", name: "employee_id", label: "Employee ID", type: "input" },
            { id: "first_name", name: "first_name", label: "First Name", type: "input" },
            { id: "last_name", name: "last_name", label: "Last Name", type: "input" },
            { id: "address", name: "address", label: "Address", type: "textarea" },
            { id: "email", name: "email", label: "Email", type: "input" },
            { id: "phone", name: "phone", label: "Phone", type: "input" },
            {
              id: "dob",
              name: "date_of_birth",
              label: "Date of Birth",
              type: "custom",
              component: ({ value, onChange }) => (
                <DateField value={value} onChange={onChange} />
              ),
            },
          ],
        },
        {
          title: "Employment Details",
          fields: [
            { id: "company", name: "company_id", label: "Company", type: "select" },
            { id: "designation", name: "designation_id", label: "Designation", type: "select" },
            { id: "role", name: "role_id", label: "Role", type: "select" },
            {
              id: "join_date",
              name: "join_date",
              label: "Join Date",
              type: "custom",
              component: ({ value, onChange }) => (
                <DateField value={value} onChange={onChange} />
              ),
            },
            {
              id: "status",
              name: "employment_status",
              label: "Status",
              type: "select",
              options: [
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ],
            },
          ],
        },
      ]}
    />
  )
}
