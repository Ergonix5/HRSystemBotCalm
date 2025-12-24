"use client"

import { Company } from "../../app/types/types"
import     { DynamicForm,FormField } from "./reusableform"
import    {DynamicForm,  FormField } from "./reusableform"

interface CompanyFormProps {
  company?: Company
  onSubmit: (data: any) => void
}

export function CompanyForm({ company, onSubmit }: CompanyFormProps) {
  const fields: FormField[] = [
    {
      id: "company-id",
      name: "company_id",
      label: "Company ID",
      placeholder: "ORG_001",
      type: "input",
      required: true,
      defaultValue: company?.company_id,
    },
    {
      id: "company-name",
      name: "company_name",
      label: "Company Name",
      placeholder: "Your company name",
      type: "input",
      required: true,
      defaultValue: company?.company_name,
    },
    {
      id: "company-description",
      name: "company_description",
      label: "Description",
      placeholder: "Company description",
      type: "textarea",
      defaultValue: company?.company_description,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: company?.status,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <DynamicForm
      title={company ? "Edit Company" : "Add New Company"}
      description="Enter company details below."
      fields={fields}
      onSubmit={onSubmit}
    />
  )
}
