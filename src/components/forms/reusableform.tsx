"use client"

import { X } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select"
import { Button } from "../ui/button"
import { FormField } from "@/src/app/types/types"
import { JSX } from "react/jsx-dev-runtime"



interface FieldGroupType {
  title: string
  fields: FormField[]
}

interface DynamicFormProps {
  title: string
  description?: string
  icon?: JSX.Element
  fields?: FormField[]             
  fieldGroups?: FieldGroupType[]    
  schema: any
  onSubmit: (data: any) => void
  onClose?: () => void
  submitLabel?: string
  gridCols?: number
  defaultValues?: Record<string, any>
}

export function DynamicForm({
  title,
  description,
  icon,
  fields,
  fieldGroups,

  schema,
  onSubmit,
  onClose,
  submitLabel = "Save",
  gridCols = 2,
 defaultValues
}: DynamicFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  })


  return (
    <div className="w-full max-w-[500px] p-3 rounded-lg mx-auto bg-white border shadow-xl flex flex-col h-[65vh]">

      {/* Header */}
      <div className="relative flex-shrink-0 bg-white border-b-2 p-6">
        <div className="flex items-start gap-4">
          {icon && (
            <span className="flex-shrink-0 text-xl bg-black text-white rounded-xl p-3">
              {icon}
            </span>
          )}
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white truncate">{title}</h2>
            {description && (
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{description}</p>
            )}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-400 hover:text-black p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all duration-200 hover:rotate-90"
          >
            <X />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="py-4 flex-1 flex flex-col overflow-hidden">
        <div className="p-6 overflow-y-auto flex-1">
          <FieldGroup>
            <FieldSet>
              {/* Render grouped fields if provided */}
              {fieldGroups
                ? fieldGroups.map((group, idx) => (
                    <div key={idx} className="mb-6">
                      <h3 className="font-bold text-zinc-800 mb-5 border-b p-2 ">{group.title}</h3>
                      <div className={`grid gap-6 grid-cols-1 xl:grid-cols-${gridCols}` }>
                        {group.fields.map((field) => (
                          <Field key={field.id}>
                            <FieldLabel>{field.label}</FieldLabel>

                            {/* INPUT */}
                            {field.type === "input" && (
                              <>
                                <Input
                                  {...register(field.name)}
                                  type={field.inputType || "text"}
                                  placeholder={field.placeholder}
                                  defaultValue={field.defaultValue}
                                />
                                {errors[field.name] && (
                                  <p className="text-sm text-red-500">
                                    {errors[field.name]?.message as string}
                                  </p>
                                )}
                              </>
                            )}

                            {/* TEXTAREA */}
                            {field.type === "textarea" && (
                              <>
                                <Textarea
                                  {...register(field.name)}
                                  placeholder={field.placeholder}
                                  className="resize-none"
                                  defaultValue={field.defaultValue}
                                />
                                {errors[field.name] && (
                                  <p className="text-sm text-red-500">
                                    {errors[field.name]?.message as string}
                                  </p>
                                )}
                              </>
                            )}

                            {/* SELECT */}
                            {field.type === "select" && (
                              <Controller
                                name={field.name}
                                control={control}
                                defaultValue={field.defaultValue || ""}
                                render={({ field: ctrl }) => (
                                  <Select
                                    value={ctrl.value}
                                    onValueChange={(val) => {
                                      ctrl.onChange(val)
                                      field.onChange?.(val)
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options?.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            )}

                            {/* CUSTOM */}
                            {field.type === "custom" && field.component && (
                              <Controller
                                name={field.name}
                                control={control}
                                defaultValue={field.defaultValue}
                                render={({ field: ctrl }) => field.component!({ value: ctrl.value, onChange: ctrl.onChange })}
                              />
                            )}
                          </Field>
                        ))}
                      </div>
                    </div>
                  ))
                : fields?.map((field) => (
                    <Field key={field.id}>
                      <FieldLabel>{field.label}</FieldLabel>
                      {/* fallback rendering for flat fields */}
                      {field.type === "input" && (
                        <Input
                          {...register(field.name)}
                          type={field.inputType || "text"}
                          placeholder={field.placeholder}
                          defaultValue={field.defaultValue}
                        />
                      )}
                      {field.type === "textarea" && (
                        <Textarea
                          {...register(field.name)}
                          placeholder={field.placeholder}
                          defaultValue={field.defaultValue}
                        />
                      )}
                      {field.type === "select" && (
                        <Controller
                          name={field.name}
                          control={control}
                          defaultValue={field.defaultValue || ""}
                          render={({ field: ctrl }) => (
                            <Select
                              value={ctrl.value}
                              onValueChange={(val) => {
                                ctrl.onChange(val)
                                field.onChange?.(val)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      )}
                      {field.type === "custom" && field.component && (
                        <Controller
                          name={field.name}
                          control={control}
                          defaultValue={field.defaultValue}
                          render={({ field: ctrl }) => field.component!({ value: ctrl.value, onChange: ctrl.onChange })}
                        />
                      )}
                      {errors[field.name] && (
                        <p className="text-sm text-red-500">
                          {errors[field.name]?.message as string}
                        </p>
                      )}
                    </Field>
                  ))}
            </FieldSet>
          </FieldGroup>
        </div>

        {/* Footer */}
        <div className="p-6 flex-shrink-0 gap-4 flex justify-end border-t">
          {onClose && (
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-[#B91434] text-white">
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  )
}
