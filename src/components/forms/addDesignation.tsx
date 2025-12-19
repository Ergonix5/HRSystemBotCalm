"use client"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Designation } from "../../app/types/types" 
interface DesignationFormProps {
  designation?: Designation
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function DesignationForm({ designation, onSubmit, onCancel }: DesignationFormProps) {
  const fields = [
    {
      id: "designation-id",
      name: "designation_id",
      label: "Designation ID",
      placeholder: "DES001",
      type: "input",
      required: true,
      defaultValue: designation?.designation_id || "",
    },
    {
      id: "title",
      name: "title",
      label: "Title",
      placeholder: "Software Engineer",
      type: "input",
      required: true,
      defaultValue: designation?.title || "",
    },
    {
      id: "company-name",
      name: "company_name",
      label: "Company Name",
      placeholder: "Acme Corp",
      type: "input",
      required: true,
      defaultValue: designation?.company_name || "",
    },
    {
      id: "description",
      name: "description",
      label: "Description",
      placeholder: "Enter designation description",
      type: "textarea",
      defaultValue: designation?.description || "",
    },
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      defaultValue: designation?.status || "",
    },
  ]

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const data = Object.fromEntries(formData)
          onSubmit(data)
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{designation ? "Edit Designation" : "Add New Designation"}</FieldLegend>
            <FieldDescription>Enter the designation details below.</FieldDescription>
            <FieldGroup>
              {fields.map((field) => (
                <Field key={field.id}>
                  <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel>
                  {field.type === "input" && (
                    <Input
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      defaultValue={field.defaultValue}
                      required={field.required || false}
                    />
                  )}
                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      defaultValue={field.defaultValue}
                      className="resize-none"
                    />
                  )}
                  {field.type === "select" && (
                    <Select defaultValue={field.defaultValue} name={field.name}>
                      <SelectTrigger id={field.id}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <Field orientation="horizontal" className="mt-4 justify-end space-x-2">
            <Button
              className="bg-[#B91434] text-white hover:bg-red-900 px-4 py-2 rounded-md"
            >
              Save
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
