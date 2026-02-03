"use client"

import { DynamicForm } from "./reusableform"
import { designationCreateSchema } from "../../validators/designation.schema"
import { FormField } from "@/src/app/types/types"
import { Briefcase } from "lucide-react"

export function AddDesignationForm({ onSubmit, onClose }: any) {
  const fields: FormField[] = [
    { id: "des_id", name: "designation_id", label: "Designation ID", type: "input" ,placeholder:"e.g. DES-001"},
    { id: "title", name: "title", label: "Title", type: "input" ,placeholder:"e.g. Senior Developer" ,required: true},
    { id: "desc", name: "description", label: "Description", type: "textarea" ,placeholder:"Enter a brief description..." },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      placeholder:"Select Status",
      defaultValue: "Active",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <DynamicForm
      title="Add Designation"
      description="Enter designation details"
       icon ={<Briefcase size={20} />}
      fields={fields}
      schema={designationCreateSchema}
      onSubmit={onSubmit}
      onClose={onClose}
      gridCols={1}
      submitLabel="Add Designation"
    />
  )
}
