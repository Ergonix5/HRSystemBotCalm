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

export type FormField = {
  id: string
  name: string
  label: string
  placeholder?: string
  type: "input" | "textarea" | "select"
  inputType?: string
  required?: boolean
  defaultValue?: any
  options?: { value: string; label: string }[]
}

interface DynamicFormProps {
  title: string
  description?: string
  fields: FormField[]
  onSubmit: (data: any) => void
  submitLabel?: string
  gridCols?: number
  mode?: "create" | "edit"
  readOnlyFields?: string[]
  hiddenFields?: Record<string, any>
}

export default function DynamicForm({
  title,
  description,
  fields,
  onSubmit,
  submitLabel = "Save",
  gridCols = 1,
  hiddenFields,
  readOnlyFields
}: DynamicFormProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)

          if (hiddenFields) {
    Object.entries(hiddenFields).forEach(([key, value]) => {
      formData.append(key, value as string)
    })
  }
          const data = Object.fromEntries(formData)
          onSubmit(data)
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-xl font-semibold">
              {title}
            </FieldLegend>

            {description && (
              <FieldDescription className="mb-4">
                {description}
              </FieldDescription>
            )}

            <div
              className={`grid gap-4 ${
                gridCols === 2 ? "md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {fields.map((field) => (
                <Field key={field.id}>
                  <FieldLabel htmlFor={field.id}>
                    {field.label}
                  </FieldLabel>

                  {field.type === "input" && (
                    <Input
                      id={field.id}
                      name={field.name}
                      placeholder={field.placeholder}
                      type={field.inputType || "text"}
                      defaultValue={field.defaultValue}
                      required={field.required}
                      readOnly={readOnlyFields?.includes(field.name)}
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
                    <Select
                      defaultValue={field.defaultValue}
                      name={field.name}
                    >
                      <SelectTrigger id={field.id}>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
              ))}
            </div>
          </FieldSet>

          <FieldSeparator className="my-6" />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#B91434] text-white hover:bg-red-900 px-6"
            >
              {submitLabel}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
