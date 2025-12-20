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
import { Company } from "../../app/types/types" 

interface CompanyFormProps {
  company?: Company
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
  const fields = [
    {
      id: "company-id",
      name: "company_id",
      label: "Company ID",
      placeholder: "ORG_001",
      type: "input",
      required: true,
      defaultValue: company?.company_id || "",
    },
    {
      id: "company-name",
      name: "company_name",
      label: "Company Name",
      placeholder: "your company name",
      type: "input",
      required: true,
      defaultValue: company?.company_name || "",
    },
    {
      id: "company-description",
      name: "company_description",
      label: "Description",
      placeholder: "your company description",
      type: "textarea",
      defaultValue: company?.company_description || "",
    },
    {
      id: "company-status",
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      defaultValue: company?.status || "",
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
            <FieldLegend>{company ? "Edit Company" : "Add New Company"}</FieldLegend>
            <FieldDescription>Enter the company details below.</FieldDescription>
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
