/**
 * PURPOSE:
 * Client Component acting as the parent dashboard coordinator for Event Creation.
 * It initializes react-hook-form state handlers, manages Tiptap Editor reference handles,
 * executes server action handlers on submission, redirects successfully created items to the
 * edit panel (/events/[id]/edit), and renders the structured form sections.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/events/create/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Editor } from "@tiptap/core"
import { createEvent } from "@/app/actions/events/post/createEvent"
import { useNotification } from "@/app/context/NotificationContext"
import { useLoader } from "@/app/context/LoaderContext"
import { EventInsert } from "@/app/types/event"
import CoreIdentitySection from "./components/CoreIdentitySection"
import TemporalLogisticsSection from "./components/TemporalLogisticsSection"
import DataPayloadSection from "./components/DataPayloadSection"

export default function CreateEventClient() {
  const router = useRouter()
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()
  const [editorValue, setEditorValue] = useState<Editor | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInsert>()

  /**
   * BEHAVIORAL MECHANISM:
   * Event submission callback handler. Combines rich text payload HTML, formats organizing milestone
   * local strings to ISO format, calls database insertions via createEvent server action,
   * triggers notifications, and directs users directly to the newly created event's edit dashboard.
   *
   * PARAMETERS:
   * - event (EventInsert): Form field value data parameters.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleCreateNewEvent = async (event: EventInsert): Promise<void> => {
    event.content = editorValue?.getHTML() || ""
    setIsOpenLoader(true)
    try {
      let formattedDate = event.organized_date
      if (event.organized_date) {
        const localDate = new Date(event.organized_date)
        formattedDate = localDate.toISOString()
      }
      
      const updatedLocalDateEvent = { ...event, organized_date: formattedDate }
      const { data, error } = await createEvent({ event: updatedLocalDateEvent })
      
      if (error) {
        throw new Error(error)
      }
      if (!data) {
        throw new Error("Failed to load newly created event.")
      }
      showNotification("Create event successfully")
      router.push(`/events/${data.id}/edit`)
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to create new event.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  // Animation variants for sections fade-in entry
  const sectionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: custom * 0.1 }
    })
  }

  return (
    <div className="w-full flex flex-col gap-8 select-none">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-4">
        <div className="flex gap-4 items-stretch">
          {/* Vertical accent bar */}
          <div className="w-[3px] bg-[#00e0b3]" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              SYSTEM_REGISTRY // VERSION_2.4.0
            </span>
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-none font-mono">
              NEW_EVENT
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[8px] tracking-widest font-bold uppercase select-none shrink-0">
          <div className="flex items-center gap-1.5 border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm text-[#00e0b3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b3] animate-pulse" />
            SYSTEM_STATUS: ACTIVE
          </div>
          <div className="border border-white/10 bg-white/5 px-3 py-1 rounded-sm text-[#83958d]">
            ID: EVT-9921-X
          </div>
        </div>
      </div>

      {/* Forms Content */}
      <form onSubmit={handleSubmit(handleCreateNewEvent)} className="w-full flex flex-col gap-10 select-text">
        
        {/* SECTION 1: CORE_IDENTITY */}
        <CoreIdentitySection register={register} errors={errors} />

        {/* SECTION 2: TEMPORAL_LOGISTICS */}
        <TemporalLogisticsSection register={register} errors={errors} />

        {/* SECTION 3: DATA_PAYLOAD */}
        <DataPayloadSection register={register} errors={errors} setEditorValue={setEditorValue} />

        {/* Submit action block */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="flex justify-end select-none mt-2"
        >
          <button
            type="submit"
            className="px-6 py-3 bg-[#00e0b3] text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            CREATE_EVENT
          </button>
        </motion.div>

      </form>
    </div>
  )
}
