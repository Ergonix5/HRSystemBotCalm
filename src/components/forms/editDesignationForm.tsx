"use client"
import { designationCreateSchema } from "../../validators/designation.schema"
import { Building2 } from "lucide-react"
import { Designation } from "../../app/types/types"
import     {DynamicForm } from "./reusableform"
import { type FormField } from '@/src/app/types/types';
interface EditDesignationFormProps {
  designation: Designation
  onSubmit: (data: any) => void
  onClose?: () => void
   defaultValues: Record<string, any>   
}

export function EditDesignationForm({
  designation,
  onSubmit,
  onClose,
  defaultValues
}: EditDesignationFormProps) {
  const fields: FormField[] = [
    {
      id: "designation-id",
      name: "designation_id",
      label: "Designation ID",
      type: "input",
      defaultValue: designation.designation_id,
    },
    {
      id: "title",
      name: "title",
      label: "Title",
      type: "input",
      required: true,
      defaultValue: designation.title,
    },
    // {
    //   id: "company-name",
    //   name: "company_name",
    //   label: "Company Name",
    //   type: "input",
    //   required: true,
    //   defaultValue: designation.company_name,
    // },
    {
      id: "description",
      name: "description",
      label: "Description",
      type: "textarea",
      defaultValue: designation.description,
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: designation.status,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ]

  return (
    <DynamicForm
      title="Edit Designation"
      description="Update designation details"
      fields={fields}
      icon={<Building2 size={20} />}
      schema={designationCreateSchema}
      gridCols={2}
      defaultValues={defaultValues} 
      submitLabel="Update Designation"
      onSubmit={onSubmit}
      onClose={onClose}
    />
  )
}
