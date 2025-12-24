"use client"

import { Company } from "../../app/types/types"
import { FormField } from "./reusableform"
import  DynamicForm from "./reusableform"

interface EditCompanyFormProps {
  company: Company
  onSubmit: (data: any) => void
}

export function EditCompanyForm({
  company,
  onSubmit,
}: EditCompanyFormProps) {
  const fields: FormField[] = [
    {
      id: "company-id",
      name: "company_id",
      label: "Company ID",
      type: "input",
      defaultValue: company.company_id,
    },
    {
      id: "company-name",
      name: "company_name",
      label: "Company Name",
      type: "input",
      required: true,
      defaultValue: company.company_name,
    },
    {
      id: "company-description",
      name: "company_description",
      label: "Description",
      type: "textarea",
      defaultValue: company.company_description,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: company.status,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <DynamicForm
      title="Edit Company"
      description="Update company information"
      fields={fields}
      mode="edit"
      readOnlyFields={["company_id"]}
      hiddenFields={{ _id: company.company_id }}
      submitLabel="Update Company"
      onSubmit={onSubmit}
    />
  )
}
