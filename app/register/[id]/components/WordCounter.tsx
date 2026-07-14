'use client'

import { useWatch, Control } from "react-hook-form"
import { RegisterForm } from "../RegisterClient"

/** Maximum number of characters allowed for the short description field. */
export const SHORT_DESCRIPTION_LENGTH = 200

/**
 * PURPOSE:
 * Renders a live character counter for the short_description field. Isolated into its own
 * component so that useWatch only triggers a re-render of this small counter node, rather
 * than causing the entire registration form to re-render on every keystroke.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/register/[id]/RegisterClient.tsx' and placed in
 * 'app/register/[id]/components/WordCounter.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - control (Control<RegisterForm>, Required): The react-hook-form control object forwarded
 *   from the parent form, used to subscribe to the short_description field value.
 */
export default function WordCounter({ control }: { control: Control<RegisterForm> }) {
  const value = useWatch({ name: "short_description", control })
  const length = value?.length ?? 0
  const isOver = length >= SHORT_DESCRIPTION_LENGTH

  return (
    <div className="flex justify-end mt-1">
      <span className={`text-[10px] font-mono ${isOver ? 'text-red-400' : 'text-[#83958d]'}`}>
        {length}
      </span>
      <span className="text-[10px] font-mono text-[#83958d]">
        /{SHORT_DESCRIPTION_LENGTH} characters
      </span>
    </div>
  )
}
