"use client"

import { X } from "lucide-react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
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
import {FormButton} from "../../components/ui/formbutton"
import { type FormField } from "@/src/app/types/types"

// Props for the DynamicForm component
interface DynamicFormProps {
  title: string
  description?: string
  fields: FormField[]
  onSubmit: (data: any) => void
  onClose?: () => void
  submitLabel?: string
  gridCols?: number
  mode?: "create" | "edit"
  readOnlyFields?: string[]
  hiddenFields?: Record<string, any>
  errors?: Record<string, string>
}

export  function DynamicForm({
  title,
  description,
  fields,
  onSubmit,
  onClose,
  submitLabel = "Save  ",
  gridCols = 2,
  hiddenFields,
  readOnlyFields,
  errors = {}
}: DynamicFormProps) {
  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl   mx-auto bg-white border border-black/10 shadow-xl overflow-hidden flex flex-col sm:flex-row">
      {/* Left Accent Border */}
      <div className="w-full sm:w-[6px] h-[6px] sm:h-auto bg-[#B91434] flex-shrink-0" />
      
      <div className="flex-grow">
        {/* Header */}
        <div className="bg-neutral-50 p-4 sm:p-6 md:p-8 border-b border-neutral-100 relative w-full">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-black text-black   tracking-wide uppercase">
            {title}
          </h2>
          {description && (
            <p className="text-neutral-500 text-xs sm:text-sm mt-2 font-medium">
              {description}
            </p>
          )}
          
          {/* Close Button */}
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-neutral-400 hover:text-black transition-colors hover:bg-neutral-200"
              aria-label="Close form"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          )}
        </div>

      {/* Form submission handling */}
      <form
        className="p-4 sm:p-6 md:p-8 flex-grow"
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

            {/* grid for form fields */}
            <div
              className={`grid gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-5 md:gap-y-6 ${gridCols === 3 ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2"
                }`}
            >
              {fields.map((field) => (
                <Field key={field.id} className={field.type === 'textarea' ? "md:col-span-2" : ""}>
                  <FieldLabel htmlFor={field.id}>
                    {field.label}
                  </FieldLabel>
                  {/* Input field */}
                  {field.type === "input" && (
                    <>
                      <Input
                        id={field.id}
                        name={field.name}
                        placeholder={field.placeholder}
                        type={field.inputType || "text"}
                        defaultValue={field.defaultValue}
                        required={field.required}
                        readOnly={readOnlyFields?.includes(field.name)}
                        className={errors[field.name] ? "border-red-500" : ""}
                      />
                      {errors[field.name] && (
                        <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                      )}
                    </>
                  )}

                  {/* Textarea field */}
                  {field.type === "textarea" && (
                    <>
                      <Textarea
                        id={field.id}
                        name={field.name}
                        placeholder={field.placeholder}
                        defaultValue={field.defaultValue}
                        className={`resize-none ${errors[field.name] ? "border-red-500" : ""}`}
                      />
                      {errors[field.name] && (
                        <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                      )}
                    </>
                  )}

                  {/* Select field */}
                  {field.type === "select" && (
                    <>
                      <Select
                        defaultValue={field.defaultValue}
                        name={field.name}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id={field.id} className={errors[field.name] ? "border-red-500" : ""}>
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
                      {errors[field.name] && (
                        <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
                      )}
                    </>
                  )}
                </Field>
              ))}
            </div>
          </FieldSet>

          {/* Separator line */}
          <FieldSeparator className="my-4 sm:my-5 md:my-6" />

          {/* Submit button */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <FormButton
              type="button"
              variant="outline"
              onClick={() => onClose?.()}
              className="border-black text-black hover:bg-neutral-50 text-sm sm:text-base sm:w-auto"
            >
              Cancel
            </FormButton>
            <FormButton
              type="submit"
              className="bg-[#B91434] text-white hover:bg-black text-sm sm:text-base w-full sm:w-auto"
            >
              {submitLabel}
            </FormButton>
          </div>
        </FieldGroup>
      </form>
      </div>
    </div>
  )
}
