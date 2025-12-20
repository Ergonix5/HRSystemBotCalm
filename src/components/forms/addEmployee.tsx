"use client"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Employee } from "../../app/types/types" 

interface EmployeeFormProps {
  employee?: Employee
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const fields = [
    { id: "employee-id", name: "employee_id", label: "Employee ID", placeholder: "EMP001", type: "input", required: true, defaultValue: employee?.employee_id || "" },
    { id: "first-name", name: "first_name", label: "First Name", placeholder: "John", type: "input", required: true, defaultValue: employee?.first_name || "" },
    { id: "last-name", name: "last_name", label: "Last Name", placeholder: "Doe", type: "input", required: true, defaultValue: employee?.last_name || "" },
    { id: "email", name: "email", label: "Email", placeholder: "john.doe@example.com", type: "input", required: true, defaultValue: employee?.email || "" },
    { id: "phone", name: "phone", label: "Phone", placeholder: "+1234567890", type: "input", required: true, defaultValue: employee?.phone || "" },
    { id: "address", name: "address", label: "Address", placeholder: "123 Main St", type: "textarea", defaultValue: employee?.address || "" },
    { id: "date-of-birth", name: "date_of_birth", label: "Date of Birth", placeholder: "", type: "input", inputType: "date", defaultValue: employee?.date_of_birth || "" },
    { id: "join-date", name: "join_date", label: "Join Date", placeholder: "", type: "input", inputType: "date", defaultValue: employee?.join_date || "" },
    { id: "company-id", name: "company_id", label: "Company ID", placeholder: "COMP001", type: "input", required: true, defaultValue: employee?.company_id || "" },
    { id: "designation-id", name: "designation_id", label: "Designation ID", placeholder: "DES001", type: "input", required: true, defaultValue: employee?.designation_id || "" },
    { id: "role-id", name: "role_id", label: "Role ID", placeholder: "ROLE001", type: "input", required: true, defaultValue: employee?.role_id || "" },
    { id: "status", name: "status", label: "Status", type: "select", options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }], defaultValue: employee?.status || "" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const data = Object.fromEntries(formData)
          onSubmit(data)
        }}
        className=" rounded-lg "
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-xl font-semibold mb-2">{employee ? "Edit Employee" : "Add New Employee"}</FieldLegend>
            <FieldDescription className="mb-4">Enter the employee details below.</FieldDescription>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <Field key={field.id} className="w-full">
                  <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
                  {field.type === "input" && (
                    <Input
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      type={(field as any).inputType || "text"}
                      defaultValue={field.defaultValue}
                      required={field.required || false}
                    />
                  )}
                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      defaultValue={field.defaultValue}
                      className="resize-none"
                    />
                  )}
                  {field.type === "select" && (
                    <Select defaultValue={field.defaultValue} name={field.name}>
                      <SelectTrigger id={field.id}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
              ))}
            </div>
          </FieldSet>

          <FieldSeparator className="my-6" />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded-md"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#B91434] text-white hover:bg-red-900 px-4 py-2 rounded-md"
            >
              Save
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
