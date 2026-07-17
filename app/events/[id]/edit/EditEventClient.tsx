/**
 * PURPOSE:
 * Client Component for the Edit Event Dashboard.
 * It manages configuration page state tabs (Basic Info, Challenge, Criteria, Awards),
 * embeds a square event poster auto-upload module, and orchestrates editing subsection panels
 * with custom Framer Motion transitions.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/events/[id]/edit/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (EventWithChallenges, Required): Event record pre-loaded with challenges array.
 */

'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { EventWithChallenges } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { updateEventPoster } from "@/app/actions/events"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { createClient } from "@/app/utils/supabase/client"
import { tw } from "@/app/constants/design-tokens"
import { EventAwardsInsert } from "@/app/types/event_awards"
import BackButton from "@/app/components/BackButton"
import BasicInfoSection from "./components/BasicInfoSection"
import ChallengeSection from "./components/ChallengeSection"
import CriteriaSection from "./components/CriteriaSection"
import AwardManagementSection from "./components/AwardManagementSection"

type ConfigPage = "basic" | "challenge" | "criteria" | "awards"

export default function EditEventClient({ event, awards }: { event: EventWithChallenges; awards: Array<EventAwardsInsert> }) {
  const supabase = createClient()
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const [challenges, setChallenges] = useState<Array<EventChallengeInsert>>(event.event_challenges)
  const [currentPage, setCurrentPage] = useState<ConfigPage>("basic")

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves the public URL for a given poster path stored in Supabase storage.
   *
   * PARAMETERS:
   * - imagePath (string): Relative storage path of the image.
   *
   * RETURNS:
   * - string: Fully qualified public URL.
   */
  const handleGetInitialImage = (imagePath: string): string => {
    const { data } = supabase.storage.from("attachments").getPublicUrl(imagePath)
    return data.publicUrl
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    event.poster_path ? handleGetInitialImage(event.poster_path) : null
  )

  /**
   * BEHAVIORAL MECHANISM:
   * Handles selection of a new poster image file. Immediately triggers the updateEventPoster
   * server action to update storage and database records, showing status loaders.
   *
   * PARAMETERS:
   * - file (File): The selected image file.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleFileChange = async (file: File): Promise<void> => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    setIsOpenLoader(true)
    try {
      const { error } = await updateEventPoster({
        eventId: event.id,
        posterFile: file,
        originalPath: event.poster_path,
      })
      if (error) {
        throw new Error(error)
      }
      showNotification("Update image successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to update poster image.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers event poster removal by calling updateEventPoster server action with null file payload,
   * cleaning up storage records and resetting local state indicators.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleRemoveAvatarFile = async (): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await updateEventPoster({
        eventId: event.id,
        posterFile: null,
        originalPath: event.poster_path,
      })
      if (error) {
        throw new Error(error)
      }
      setPreviewUrl(null)
      showNotification("Remove image successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to remove poster image.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Back button */}
      <BackButton />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 select-none">
        <div className="flex gap-4 items-stretch">
          <div className="w-[3px] bg-[#00e0b3]" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              SYSTEM_REGISTRY // EVENT_MANAGEMENT
            </span>
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              EVENT_CONFIGURATION
            </h1>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [CONFIG_MODE_ON]
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Square Event Poster */}
        <div className="lg:col-span-4 flex flex-col gap-4 select-none">
          <div className="flex gap-2 items-center text-[8.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-xs">image</span>
            EVENT_POSTER_IMAGE
          </div>
          
          <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-2 flex flex-col items-center justify-center`}>
            {/* Square crop box container */}
            <div className="relative w-full aspect-square border border-dashed border-white/10 hover:border-[#00e0b3]/50 transition-colors bg-white/5 flex items-center justify-center cursor-pointer rounded-sm overflow-hidden group">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Event Poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 288px"
                    className="object-cover"
                  />
                  {/* Hover overlay text info */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-mono text-[#00e0b3] font-bold uppercase tracking-widest">
                      [+] CHANGE_POSTER
                    </span>
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleRemoveAvatarFile()
                    }}
                    type="button"
                    className="absolute top-3 right-3 w-6 h-6 rounded-sm bg-black border border-white/10 text-red-400 hover:text-red-300 hover:border-red-400/30 transition-all flex items-center justify-center cursor-pointer z-10"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </>
              ) : (
                <div className="text-center p-4 flex flex-col items-center gap-2 text-[#83958d]">
                  <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold">
                    UPLOAD_POSTER_IMAGE
                  </span>
                  <span className="text-[7.5px] font-mono opacity-60">
                    (RECOMMENDED SQUARE ASPECT)
                  </span>
                </div>
              )}

              {/* Upload Input overlay */}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-0"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    handleFileChange(files[0])
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard Navigation and Configuration Sections */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tab Navigation row */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#1a1817] p-1 rounded-sm border border-white/5 select-none w-full">
            {(["basic", "challenge", "criteria", "awards"] as ConfigPage[]).map((tab) => {
              const isActive = currentPage === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCurrentPage(tab)}
                  className={`w-full text-center py-2.5 font-mono text-[10px] uppercase font-bold tracking-widest transition-all duration-300 rounded-sm relative select-none cursor-pointer ${
                    isActive ? "text-[#00382b]" : "text-[#b9cbc2] hover:text-[#e8e1df]"
                  }`}
                >
                  {/* Slide animation pill */}
                  {isActive && (
                    <motion.div
                      layoutId="editTabActiveIndicator"
                      className="absolute inset-0 bg-[#00e0b3] rounded-sm z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab === "basic" ? "Basic Info" : tab === "challenge" ? "Challenge" : tab === "criteria" ? "Criteria" : "Awards"}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Configuration Panel */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {currentPage === "basic" && (
                  <BasicInfoSection page={currentPage} event={event} />
                )}
                {currentPage === "challenge" && (
                  <ChallengeSection
                    page={currentPage}
                    challenges={challenges}
                    setChallenges={setChallenges}
                    event={event}
                  />
                )}
                {currentPage === "criteria" && (
                  <CriteriaSection
                    receivedCriteria={event.event_grading_criteria ?? []}
                    eventId={event.id}
                    page={currentPage}
                  />
                )}
                {currentPage === "awards" && (
                  <AwardManagementSection
                    receivedAwards={awards}
                    eventId={event.id}
                    page={currentPage}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  )
}