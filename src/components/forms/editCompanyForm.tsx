"use client"

import { Company } from "../../app/types/types"
import {DynamicForm} from "./reusableform"
import { type FormField } from '@/src/app/types/types';

interface EditCompanyFormProps {
  company: Company
  onSubmit: (data: any) => void
  onClose?: () => void
}

export function EditCompanyForm({
  company,
  onSubmit,
  onClose,
}: EditCompanyFormProps) {
  const fields: FormField[] = [
    {
      id: "organization-id",
      name: "organization_id",
      label: "Organization ID",
      type: "input",
      defaultValue: company.company_id,
    },
    {
      id: "organization-name",
      name: "name",
      label: "Organization Name",
      type: "input",
      required: true,
      defaultValue: company.company_name,
    },
    {
      id: "organization-description",
      name: "description",
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
      readOnlyFields={["organization_id"]}
      hiddenFields={{ _id: company._id }}
      submitLabel="Update Company"
      onSubmit={onSubmit}
      onClose={onClose}
    />
  )
}
