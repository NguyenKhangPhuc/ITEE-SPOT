/**
 * PURPOSE:
 * Renders the Data Payload form section for the Event Creation panel.
 * Contains textarea input for Short Description (Abstract) and Tiptap SimpleEditor for Full Specification.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of CreateEventClient.tsx, located at 'app/events/create/components/DataPayloadSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<EventInsert>, Required): react-hook-form register callback.
 * - errors (FieldErrors<EventInsert>, Required): react-hook-form errors validation map.
 * - setEditorValue ((editor: Editor | null) => void, Required): callback to reference Tiptap editor handle.
 */

'use client'

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Editor } from "@tiptap/core"
import { EventInsert } from "@/app/types/event"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import { tw } from "@/app/constants/design-tokens"

interface DataPayloadSectionProps {
  register: UseFormRegister<EventInsert>
  errors: FieldErrors<EventInsert>
  setEditorValue: (editor: Editor | null) => void
}

export default function DataPayloadSection({ register, errors, setEditorValue }: DataPayloadSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-white/5">
      {/* Section description side */}
      <div className="lg:col-span-4 flex gap-3 select-none">
        <div className="w-[2px] h-4 bg-[#00e0b3] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
            DATA_PAYLOAD
          </h2>
          <p className="text-[9.5px] font-mono text-[#83958d] leading-relaxed">
            Detail the mission parameters and technical specifications.
          </p>
        </div>
      </div>

      {/* Section fields container */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 lg:col-span-8 flex flex-col gap-6`}>
        {/* Abstract */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            ABSTRACT (SHORT DESCRIPTION)
          </span>
          <textarea
            placeholder="Brief summary for indexing..."
            rows={3}
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full resize-none"
            {...register("short_description", { required: true })}
          />
          {errors.short_description && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] Brief abstract payload indexing parameter required.
            </span>
          )}
        </div>

        {/* Rich Text Editor */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between select-none">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              FULL SPECIFICATION (RICH TEXT EDITOR)
            </span>
            <span className="text-[6.5px] font-mono text-[#00e0b3]/70 uppercase tracking-widest font-bold">
              AUTO_SAVE: ON
            </span>
          </div>
          <div className="w-full bg-[#151312] border border-white/5 rounded-sm overflow-hidden select-text text-black">
            <SimpleEditor
              initialContent={null}
              onEditorReady={setEditorValue}
              limit={EVENT_CREATED_DESCRIPTION}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
