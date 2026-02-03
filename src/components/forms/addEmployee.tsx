"use client"
import React from "react"
import { DynamicForm } from "./reusableform"
import { employeeCreateSchema } from "../../validators/employee.schema"
import { FormField } from "@/src/app/types/types"
import { useEffect, useState } from "react"
import { UserPlus } from "lucide-react"
import { Calendar } from "../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Button } from "../../components/ui/button"
import { format } from "date-fns"
interface AddEmployeeFormProps {
  onSubmit: (data: any) => void
  onClose: () => void
  employee?: any 
} 

export function AddEmployeeForm({ onSubmit, onClose, employee }: AddEmployeeFormProps) {
  const [companies, setCompanies] = useState([])
  const [designations, setDesignations] = useState([])
  const [roles, setRoles] = useState([])
  const [companyId, setCompanyId] = useState("")
  const [loading, setLoading] = useState(false)
  const [date,setDate] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    fetchDropdown()
  }, [])
  useEffect(() => {
    fetch("/api/Organization")
      .then(res => res.json())
      .then(data =>
        setCompanies(data.data.map((c: any) => ({
          value: c._id,
          label: c.name,
        })))
      )
  }, [])

  const fetchDropdown = async () => {
    try {
      setLoading(true)
      const designationsRes = await fetch('/api/Designation?limit=100')
const designationsData = await designationsRes.json()
setDesignations(designationsData.data.map((d: any) => ({
  value: d._id,
  label: d.title,
})) || [])

    } catch (error) {
      console.error("Error fetching dropdown data:", error)
    } finally {
      setLoading(false)
    }
  }


useEffect(() => {
  if (!companyId) return
  fetch(`/api/Role?organizationId=${companyId}`)
    .then(res => res.json())
    .then(data =>
      setRoles(data.data.map((r: any) => ({
        value: r._id,
        label: r.role_name,
      })))
    )
}, [companyId])


const personalDetails: FormField[] = [
  { id: "employee_id", name: "employee_id", label: "Employee ID", type: "input", required: true, defaultValue: employee?.employee_id ,placeholder:"Enter Employee ID"},
  { id: "first_name", name: "first_name", label: "First Name", type: "input", required: true, defaultValue: employee?.first_name ,placeholder:"Enter First Name"},
  { id: "last_name", name: "last_name", label: "Last Name", type: "input", required: true, defaultValue: employee?.last_name ,placeholder:"Enter Last Name"},
  { id: "address", name: "address", label: "Address", type: "textarea", defaultValue: employee?.address ,placeholder:"Enter Address" },
  { id: "email", name: "email", label: "Email", type: "input", required: true, defaultValue: employee?.email ,placeholder:"Enter Email" },
  { id: "phone", name: "phone", label: "Phone", type: "input", required: true, defaultValue: employee?.phone ,placeholder:"Enter Phone" },
  { 
    id: "dob", 
    name: "date_of_birth", 
    label: "Date of Birth", 
    type: "custom", 
    placeholder:"Select Date of Birth",
    component: ({ value, onChange }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            {value ? format(new Date(value), "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
           mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    ),
    defaultValue: employee?.date_of_birth 
  },
];

const employmentDetails: FormField[] = [
  { id: "company", name: "company_id", label: "Company", type: "select", options: companies, onChange: setCompanyId  ,placeholder:"Select Company"},
  { id: "designation", name: "designation_id", label: "Designation", type: "select", options: designations ,placeholder:"Select Designation"},
  { id: "role", name: "role_id", label: "Role", type: "select", options: roles ,defaultValue: employee?.role_id ,placeholder:"Select Role"},
  
  { 
    id: "join_date", 
    name: "join_date", 
    label: "Join Date", 
    type: "custom",
    placeholder:"Select Join Date",
    component: ({ value, onChange }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            {value ? format(new Date(value), "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
             mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    ),
    defaultValue: employee?.join_date 
  },
  { id: "status", name: "employment_status", label: "Status", type: "select", defaultValue: employee?.employment_status, options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] ,placeholder:"Select Status"},
];

return (
 
      <DynamicForm
    title="Add Employee"
    description="Enter employee details"
     icon ={<UserPlus size={20} />}
    fieldGroups={[
    { title: "Personal Details", fields: personalDetails },
    { title: "Employment Details", fields: employmentDetails },
  ]}
    schema={employeeCreateSchema}
    onSubmit={onSubmit}
    onClose={onClose}
    gridCols={2}
  />
 

)
}
