"use client"

import { Employee } from "../../app/types/types"
import { DynamicForm } from "./reusableform"
import { type FormField } from '@/src/app/types/types';
import { useFormValidation } from '../../hooks/useFormValidation'
import { employeeCreateSchema } from '../../validators/employee.schema'
import { useState, useEffect } from 'react'

interface DropdownOption {
  value: string
  label: string
}

export function EmployeeForm({
  employee,
  onSubmit,
  onClose,
}: {
  employee?: Employee
  onSubmit: (data: any) => void
  onClose?: () => void
}) {
  const { errors, validate } = useFormValidation(employeeCreateSchema)
  const [companies, setCompanies] = useState<DropdownOption[]>([])
  const [designations, setDesignations] = useState<DropdownOption[]>([])
  const [roles, setRoles] = useState<DropdownOption[]>([])
  const [employees, setEmployees] = useState<DropdownOption[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDropdownData()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      fetchRoles(selectedCompany)
      fetchEmployees(selectedCompany)
    }
  }, [selectedCompany])

  const fetchDropdownData = async () => {
    try {
      setLoading(true)

      // Fetch companies
      const companiesRes = await fetch('/api/Organization?limit=100')
      const companiesData = await companiesRes.json()
      setCompanies(companiesData.data?.map((org: any) => ({
        value: org._id,
        label: org.title || org.name
      })) || [])

      // Fetch designations
      const designationsRes = await fetch('/api/Designation?limit=100')
      const designationsData = await designationsRes.json()
      setDesignations(designationsData.data?.map((des: any) => ({
        value: des._id,
        label: des.title
      })) || [])

    } catch (error) {
      console.error('Error fetching dropdown data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async (organizationId: string) => {
    try {
      const rolesRes = await fetch(`/api/Role?organizationId=${organizationId}&limit=100`)
      const rolesData = await rolesRes.json()
      setRoles(rolesData.data?.map((role: any) => ({
        value: role._id,
        label: role.role_name
      })) || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const fetchEmployees = async (organizationId: string) => {
    try {
      const employeesRes = await fetch(`/api/employee?organizationId=${organizationId}&limit=100`)
      const employeesData = await employeesRes.json()
      setEmployees(employeesData.data?.map((emp: any) => ({
        value: emp._id,
        label: `${emp.first_name} ${emp.last_name}`
      })) || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value)
    setRoles([])
    setEmployees([])
  }

  const fields: FormField[] = [
    {
      id: "organization",
      name: "organization",
      label: "Company Name",
      type: "select",
      required: true,
      defaultValue: employee?.organization || "",
      options: companies,
      onChange: handleCompanyChange
    },
    {
      id: "designation",
      name: "designation",
      label: "Designation Name",
      type: "select",
      required: true,
      defaultValue: employee?.designation || "",
      options: designations
    },
    {
      id: "role",
      name: "role",
      label: "Role Name",
      type: "select",
      required: true,
      defaultValue: employee?.role || "",
      options: roles
    },

    { id: "employee-id", name: "employee_id", label: "Employee ID", type: "input", required: true, defaultValue: employee?.employee_id },
    { id: "first-name", name: "first_name", label: "First Name", type: "input", required: true, defaultValue: employee?.first_name },
    { id: "last-name", name: "last_name", label: "Last Name", type: "input", required: true, defaultValue: employee?.last_name },
    { id: "email", name: "email", label: "Email", type: "input", required: true, defaultValue: employee?.email },
    { id: "phone", name: "phone", label: "Phone", type: "input", required: true, defaultValue: employee?.phone },
    { id: "address", name: "address", label: "Address", type: "textarea", defaultValue: employee?.address },
    { id: "dob", name: "date_of_birth", label: "Date of Birth", type: "input", inputType: "date", defaultValue: employee?.date_of_birth },
    { id: "join-date", name: "join_date", label: "Join Date", type: "input", inputType: "date", defaultValue: employee?.join_date },
    { id: "status", name: "employment_status", label: "Status", type: "select", defaultValue: employee?.employment_status, options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] },
  ]

  const handleSubmit = (data: any) => {
    if (validate(data)) {
      onSubmit(data)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8">Loading...</div>
  }

  return (
    <DynamicForm
      title={employee ? "Edit Employee" : "Add New Employee"}
      description="Enter employee details below."
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      gridCols={2}
      errors={errors}
    />
  )
}
