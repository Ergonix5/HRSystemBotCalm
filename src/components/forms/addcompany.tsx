"use client"

import { Company } from "../../app/types/types"
import    {DynamicForm } from "./reusableform"
import { type FormField } from '@/src/app/types/types';


interface CompanyFormProps {
  company?: Company
  onSubmit: (data: any) => void
}

export function CompanyForm({ company, onSubmit }: CompanyFormProps) {
  const fields: FormField[] = [
    {
      id: "organization-id",
      name: "organization_id",
      label: "Organization ID",
      placeholder: "ORG_001",
      type: "input",
      required: true,
      defaultValue: company?.company_id,
    },
    {
      id: "organization-name",
      name: "name",
      label: "Organization Name",
      placeholder: "Your organization name",
      type: "input",
      required: true,
      defaultValue: company?.company_name,
    },
    {
      id: "organization-description",
      name: "description",
      label: "Description",
      placeholder: "Organization description",
      type: "textarea",
      defaultValue: company?.company_description,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      // defaultValue: company?.status?.toLowerCase(),
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <DynamicForm
      title={company ? "Edit Organization" : "Add New Organization"}
      description="Enter organization details below."
      fields={fields}
      onSubmit={onSubmit}
    />
  )
}
