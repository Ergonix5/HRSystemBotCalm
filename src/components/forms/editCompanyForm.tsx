"use client"

import { DynamicForm } from "./reusableform"
import { organizationCreateSchema } from "../../validators/organization.schema"
import { Company, FormField } from "@/src/app/types/types"
import { Building2 } from "lucide-react"

interface EditCompanyFormProps {
  company: Company
  onSubmit: (data: any) => void
  onClose?: () => void
  defaultValues: Record<string, any>   
}

export function EditCompanyForm({ company, onSubmit, onClose, defaultValues }: EditCompanyFormProps) {
  const fields: FormField[] = [
    { id: "org_id", name: "organization_id", label: "Organization ID", type: "input" ,defaultValue: company.company_id},
    { id: "name", name: "name", label: "Company Name", type: "input" ,defaultValue: company.company_name},
    { id: "desc", name: "description", label: "Description", type: "textarea" ,defaultValue: company.company_description
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
      description="Update company details"
      icon={<Building2 size={20} />}
      fields={fields}
      schema={organizationCreateSchema}
      onSubmit={onSubmit}
      onClose={onClose}
      gridCols={2}
      defaultValues={defaultValues} 
      submitLabel="Update Company"
    />
  )
}