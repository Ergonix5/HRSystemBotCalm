"use client"

import { Designation } from "../../app/types/types"
import { DynamicForm, FormField } from "./reusableform"

export function DesignationForm({
  designation,
  onSubmit,
}: {
  designation?: Designation
  onSubmit: (data: any) => void
}) {
  const fields: FormField[] = [
    {
      id: "designation-id",
      name: "designation_id",
      label: "Designation ID",
      type: "input",
      required: true,
      defaultValue: designation?.designation_id,
    },
    {
      id: "title",
      name: "title",
      label: "Title",
      type: "input",
      required: true,
      defaultValue: designation?.title,
    },
    {
      id: "company-name",
      name: "company_name",
      label: "Company Name",
      type: "input",
      required: true,
      defaultValue: designation?.company_name,
    },
    {
      id: "description",
      name: "description",
      label: "Description",
      type: "textarea",
      defaultValue: designation?.description,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: designation?.status,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <DynamicForm
      title={designation ? "Edit Designation" : "Add New Designation"}
      description="Enter designation details below."
      fields={fields}
      onSubmit={onSubmit}
    />
  )
}
