"use client"

import { DynamicForm } from "./reusableform"
import {organizationCreateSchema}  from "../../validators/organization.schema"
import { FormField } from "@/src/app/types/types"
import { Building2 } from "lucide-react"

export function AddCompanyForm({ onSubmit, onClose }: any) {
  const fields: FormField[] = [
    { id: "org_id", name: "organization_id", placeholder: "e.g. ORG-001", label: "Organization ID", type: "input" },
    { id: "name", name: "name", placeholder: "e.g. Acme Corp Industries", label: "Company Name", type: "input" },
    { id: "desc", name: "description", placeholder: "Enter a brief overview...",label: "Description", type: "textarea" },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <DynamicForm
      title="Add Company"
      description="Enter company details"
      icon ={<Building2 size={20} />}
      fields={fields}
      schema={organizationCreateSchema}
      onSubmit={onSubmit}
      onClose={onClose}
      gridCols={2}
    />
  )
}
