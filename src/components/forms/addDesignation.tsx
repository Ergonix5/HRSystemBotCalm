"use client"

import { Designation } from "../../app/types/types"
import { DynamicForm } from "./reusableform"
import { type FormField } from '@/src/app/types/types';
import { useFormValidation } from '../../hooks/useFormValidation'
import { designationCreateSchema } from '../../validators/designation.schema'

export function DesignationForm({
  designation,
  onSubmit,
}: {
  designation?: Designation
  onSubmit: (data: any) => void
}) {
  const { errors, validate } = useFormValidation(designationCreateSchema)

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
      defaultValue: designation?.status || "Active",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  const handleSubmit = (data: any) => {
    if (validate(data)) {
      onSubmit(data)
    }
  }

  return (
    <DynamicForm
      title={designation ? "Edit Designation" : "Add New Designation"}
      description="Enter designation details below."
      fields={fields}
      onSubmit={handleSubmit}
      errors={errors}
    />
  )
}
