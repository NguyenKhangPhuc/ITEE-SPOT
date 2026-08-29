/**
 * PURPOSE:
 * Renders the basic event information editing form section.
 * Includes fields for title, dates, organized time, max capacity, short description,
 * and a rich-text specification editor.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of EditEventClient.tsx, located at 'app/events/[id]/edit/components/BasicInfoSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (EventWithChallenges, Required): Event record to retrieve default form values from.
 */

'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Editor } from "@tiptap/core"
import { updateEventInfo } from "@/app/actions/events/put/updateEventInfo"
import { EVENT_CREATED_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventInsert, EventWithChallenges } from "@/app/types/event"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { tw } from "@/app/constants/design-tokens"

interface BasicInfoSectionProps {
  event: EventWithChallenges,
  page: string
}

export default function BasicInfoSection({ event, page }: BasicInfoSectionProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()
  const [editorValue, setEditorValue] = useState<Editor | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInsert>({
    defaultValues: {
      ...event,
      organized_date: new Date(event.organized_date ?? "")
        .toISOString()
        .slice(0, 16),
    },
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Handles submitting updated basic information. Formats localized organized date to ISO date string,
   * extracts the rich editor HTML, and executes database updates via server action.
   *
   * PARAMETERS:
   * - payload (EventInsert): The basic information form fields values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleUpdateEventInfo = async (payload: EventInsert): Promise<void> => {
    payload.content = editorValue?.getHTML() || ""
    setIsOpenLoader(true)
    try {
      const localDate = new Date(payload.organized_date!)
      const formattedDate = localDate.toISOString()
      const updatedLocalDateEvent = { ...payload, organized_date: formattedDate }

      if (!event.id) throw new Error("Event ID missing")
      const { error } = await updateEventInfo({ event: updatedLocalDateEvent })
      if (error) {
        throw new Error(error)
      }
      showNotification("Update event successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to update event basic info.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  if (page !== "basic") {
    return null
  }
  return (
    <form onSubmit={handleSubmit(handleUpdateEventInfo)} className="w-full flex flex-col gap-10 select-text">

      {/* SECTION 1: CORE_IDENTITY */}
      <div className="w-full pb-8 border-b border-white/5">
        <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-5`}>
          {/* Title */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              EVENT TITLE
            </span>
            <input
              type="text"
              placeholder="e.g. Q4 SYSTEM ARCHITECTURE REVIEW"
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.title.message}
              </span>
            )}
          </div>

          {/* Max Capacity */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              MAX MEMBERS
            </span>
            <input
              type="number"
              min="1"
              placeholder="0"
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
              {...register("max_group_members", { required: "Max group members is required", valueAsNumber: true })}
            />
            {errors.max_group_members && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.max_group_members.message}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              LOCATION / NODE
            </span>
            <input
              type="text"
              placeholder="e.g. DISTRIBUTED // HUB_A"
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.location.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: TEMPORAL_LOGISTICS */}
      <div className="w-full pb-8 border-b border-white/5">
        <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-5`}>
          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              START DATE
            </span>
            <input
              type="date"
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full select-none"
              {...register("start_date", { required: "Start date is required" })}
            />
            {errors.start_date && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.start_date.message}
              </span>
            )}
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              END DATE
            </span>
            <input
              type="date"
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full select-none"
              {...register("end_date", { required: "End date is required" })}
            />
            {errors.end_date && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.end_date.message}
              </span>
            )}
          </div>

          {/* Organized DateTime */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              ORGANIZATION TIMESTAMP (DATE & TIME)
            </span>
            <input
              type="datetime-local"
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full select-none"
              {...register("organized_date", { required: "Organized Date is required" })}
            />
            {errors.organized_date && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.organized_date.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: DATA_PAYLOAD */}
      <div className="w-full pb-8">
        <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-6`}>
          {/* Abstract */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              ABSTRACT (SHORT DESCRIPTION)
            </span>
            <textarea
              placeholder="Short Description"
              rows={3}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full resize-none"
              {...register("short_description", { required: "Short description is required" })}
            />
            {errors.short_description && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.short_description.message}
              </span>
            )}
          </div>

          {/* Rich Editor */}
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
                initialContent={event.content}
                onEditorReady={setEditorValue}
                limit={EVENT_CREATED_DESCRIPTION}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Action block */}
      <div className="flex justify-end select-none mt-2">
        <button
          type="submit"
          className="px-6 py-3 bg-[#00e0b3] text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm font-bold">save</span>
          SAVE_CHANGES
        </button>
      </div>

    </form>
  )
}
