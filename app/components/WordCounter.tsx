'use client'

import { useWatch, Control, FieldValues, Path } from "react-hook-form"

interface WordCounterProps<T extends FieldValues> {
  control: Control<T>
  fieldName: Path<T>
  limit: number
}

/**
 * PURPOSE:
 * A globally reusable, type-safe character counter component. It hooks into the react-hook-form
 * state via useWatch to read the target field's value live, rendering the current character count
 * against the configured limit. It utilizes react-hook-form generics to ensure the field name
 * belongs to the form type.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/components/WordCounter.tsx' to be shared between registration,
 * group settings, and submission forms.
 *
 * INPUTS / PARAMETERS:
 * - control (Control<T>, Required): The react-hook-form control object.
 * - fieldName (Path<T>, Required): The generic key/path of the watched form field.
 * - limit (number, Required): The maximum character limit allowed.
 */
export default function WordCounter<T extends FieldValues>({
  control,
  fieldName,
  limit,
}: WordCounterProps<T>) {
  const value = useWatch({ name: fieldName, control })
  const length = (value as string | undefined)?.length ?? 0
  const isOver = length >= limit

  return (
    <div className="flex justify-end mt-1">
      <span className={`text-[10px] font-mono ${isOver ? 'text-red-400' : 'text-[#83958d]'}`}>
        {length}
      </span>
      <span className="text-[10px] font-mono text-[#83958d]">
        /{limit} characters
      </span>
    </div>
  )
}