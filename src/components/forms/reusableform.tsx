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
  gridCols = 3,
  hiddenFields,
  readOnlyFields,
  errors = {}
}: DynamicFormProps) {
  return (
<div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto 
  bg-white 
  border 
  border-l-5 border-l-[#B91434] 
  shadow-xl overflow-hidden flex flex-col xl:h-[70vh]"
>
      {/* Header */}
        <div className="bg-neutral-50 p-4 sm:p-6 md:p-8 border-b border-neutral-100 relative flex-shrink-0">
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
        className="flex flex-col flex-1 overflow-hidden"
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

        {/* scrolble body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8"> 
        <FieldGroup>
          <FieldSet>

            {/* grid for form fields */}
            <div
              className={`grid gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-5 md:gap-y-6 ${gridCols === 2 ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-2"
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
          </FieldGroup>
</div>
          {/* Separator line */}
          {/* <FieldSeparator className="my-4 sm:my-5 md:my-6" /> */}

 <div className="flex-shrink-0 border-t border-neutral-100 
          p-4 sm:p-6 bg-white"
        >

  
          {/* Submit button */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 ">
            <FormButton
              type="button"
              variant="outline"
              onClick={() => onClose?.()}

            >
              Cancel
            </FormButton>
            <FormButton
              type="submit"
              className="bg-[#B91434] text-white hover:bg-black text-sm sm:text-base "
            >
              {submitLabel}
            </FormButton>
          </div>
        </div>
      </form>
      </div>
   
  )
}
