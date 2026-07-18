'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { EVENT_STATUS } from "../../types/enum"
import { EventInsert } from "../../types/event"
import { tw } from "@/app/constants/design-tokens"

interface EventCardProp {
  event: EventInsert
  handleGetUrl: (imagePath: string) => string
}

/**
 * PURPOSE:
 * This component renders an individual event card in the events directory. It features a
 * top image section with status overlays, title, dynamic date formatting, organized timing details,
 * and status-based action buttons.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/events/Event.tsx' and moved to 'app/events/components/Event.tsx'
 * to isolate presentation card layouts.
 *
 * INPUTS / PARAMETERS:
 * - event (EventInsert, Required): The event data row to display.
 * - handleGetUrl ((imagePath: string) => string, Required): Helper function to get public asset URLs.
 */
export default function EventCard({ event, handleGetUrl }: EventCardProp) {
  const isOngoing = event.status === EVENT_STATUS.ONGOING
  const isRegistrationOngoing = event.registration_status === EVENT_STATUS.ONGOING

  /**
   * BEHAVIORAL MECHANISM:
   * Parses a raw date string and returns a formatted uppercase string containing the month,
   * two-digit day, and year. If the date is missing, returns a standard 'N/A' placeholder.
   *
   * PARAMETERS:
   * - dateStr (string | null | undefined): The raw date string.
   *
   * RETURNS:
   * - string: The formatted date representation.
   */
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Formats the starting and ending dates of the event into a single duration range string.
   * If the ending date is absent, only the starting date is formatted and returned.
   *
   * PARAMETERS:
   * - start (string | null | undefined): The start date string.
   * - end (string | null | undefined): The end date string.
   *
   * RETURNS:
   * - string: The formatted range output.
   */
  const formatDuration = (start: string | null | undefined, end: string | null | undefined): string => {
    if (!start) return 'N/A'
    const sDate = new Date(start)
    const formattedStart = sDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()
    if (!end) return formattedStart
    const eDate = new Date(end)
    const formattedEnd = eDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()
    return `${formattedStart} - ${formattedEnd}`
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Extracts the clock time from a date-time string and formats it as AM/PM.
   *
   * PARAMETERS:
   * - dateStr (string | null | undefined): The raw organized date-time string.
   *
   * RETURNS:
   * - string: Formatted 12-hour clock time.
   */
  const formatTime = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toUpperCase()
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className="w-full flex"
    >
      <Link
        href={`/events/${event.id}`}
        className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border overflow-hidden rounded-sm flex flex-col hover:border-[#00e0b3]/40 hover:shadow-[0_0_15px_rgba(0,224,179,0.1)] transition-all duration-300 min-h-[460px] group w-full`}
      >
        {/* Top Image Section */}
        <div className="relative w-full h-48 overflow-hidden bg-[#2c2928] shrink-0 border-b border-white/5">
          {/* Status Badge Tag */}
          <div className={`absolute top-4 left-4 z-10 font-mono text-[9px] px-2 py-0.5 tracking-wider uppercase font-bold rounded-sm border ${
            isOngoing 
              ? 'bg-[#00e0b3]/10 border-[#00e0b3]/30 text-[#00e0b3]' 
              : 'bg-white/5 border-white/10 text-[#83958d]'
          }`}>
            {isOngoing ? '[ ACTIVE ]' : '[ COMPLETED ]'}
          </div>

          {event.poster_path ? (
            <Image
              alt={event.title || "Event Poster"}
              className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              src={handleGetUrl(event.poster_path)}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#83958d] uppercase">
              no image
            </div>
          )}
          
          {/* Gradient Bottom Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b1a] via-[#1d1b1a]/20 to-transparent"></div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            {/* Title & Status Icon */}
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="text-base md:text-lg font-bold group-hover:text-[#00e0b3] transition-colors line-clamp-1">
                {event.title}
              </h3>
              {isOngoing ? (
                <span className="material-symbols-outlined text-[#00e0b3] text-sm shrink-0">
                  bolt
                </span>
              ) : (
                <span className="material-symbols-outlined text-[#83958d] text-sm shrink-0">
                  lock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[#b9cbc2] opacity-75 line-clamp-2 leading-relaxed mb-6">
              {event.short_description || "No short description provided."}
            </p>
          </div>

          <div>
            {/* Metadata Grid */}
            <div className="border-t border-white/5 pt-4 mb-6 flex flex-col gap-3">
              {/* Row 1: Duration & Capacity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Duration
                  </span>
                  <span className="text-[10px] font-mono text-[#00e0b3] font-semibold">
                    {formatDuration(event.start_date, event.end_date)}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Capacity
                  </span>
                  <span className="text-[10px] font-mono text-[#00e0b3] font-semibold">
                    {event.max_group_members ? `${event.max_group_members}M / G` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Row 2: Org Date & Org Time */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Org_Date
                  </span>
                  <span className="text-[10px] font-mono text-[#b9cbc2]">
                    {formatDate(event.organized_date)}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                    Org_Time
                  </span>
                  <span className="text-[10px] font-mono text-[#b9cbc2]">
                    {formatTime(event.organized_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Button */}
            <div className="mt-auto">
              {isRegistrationOngoing ? (
                <span className="block border border-[#00e0b3]/40 text-[#00e0b3] bg-transparent group-hover:bg-[#00e0b3]/10 font-mono text-[9px] uppercase font-bold py-2.5 w-full text-center transition-all duration-300 tracking-widest rounded-sm">
                  Initialize Application
                </span>
              ) : (
                <span className="block border border-white/5 text-[#83958d] bg-[#151312]/20 text-center font-mono text-[9px] uppercase font-bold py-2.5 w-full tracking-widest rounded-sm">
                  Registration Locked
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
