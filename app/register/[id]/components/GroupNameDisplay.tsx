'use client'

import { useWatch, Control } from "react-hook-form"
import { RegisterForm } from "../RegisterClient"

/**
 * PURPOSE:
 * Renders a live preview of the group name typed by the user. Isolated into its own
 * component so that useWatch only re-renders this display node, not the entire sidebar
 * or page, on every keystroke in the group name input field.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/register/[id]/RegisterClient.tsx' and placed in
 * 'app/register/[id]/components/GroupNameDisplay.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - control (Control<RegisterForm>, Required): The react-hook-form control object forwarded
 *   from the parent form, used to subscribe to the title field value.
 */
export default function GroupNameDisplay({ control }: { control: Control<RegisterForm> }) {
  const title = useWatch({ name: "title", control })

  return (
    <span className="text-[#00e0b3] font-mono font-bold">
      {title?.trim() ? title.toUpperCase() : '[PENDING_INPUT]'}
    </span>
  )
}
