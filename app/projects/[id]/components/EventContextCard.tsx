/**
 * PURPOSE:
 * Renders the Event Context sidebar card containing the event name, status, schedule,
 * location, and a large poster preview image.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/projects/[id]/SingleProjectClient.tsx' to simplify the event metadata sidebar.
 *
 * INPUTS / PARAMETERS:
 * - event (EventInsert | null, Required): The event database row object.
 * - projectId (string | null, Required): The ID of the current showcase project.
 */

'use client'

import Link from "next/link"
import Image from "next/image"
import { EventInsert } from "../../../types/event"
import { EVENT_STATUS } from "../../../types/enum"
import { createClient } from "@/app/utils/supabase/client"
import { handleGetUrl } from "@/app/helpers/FileUrl"
import { tw } from "@/app/constants/design-tokens"

interface EventContextCardProps {
  event: EventInsert | null
  projectId: string | null
}

export default function EventContextCard({ event, projectId }: EventContextCardProps) {
  const supabase = createClient()

  /**
   * BEHAVIORAL MECHANISM:
   * Formats database date strings into uniform Vietnamese date formatting.
   *
   * PARAMETERS:
   * - dateString (string | null): Raw ISO date string.
   *
   * RETURNS:
   * - string: Formatted date string or 'N/A' if null.
   */
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  /**
   * BEHAVIORAL MECHANISM:
   * The component renders a sidebar layout for the associated event. It resolves
   * and displays the poster image (with an increased height of h-44 for better visibility),
   * event details, status color codes, and unique project registry ID.
   *
   * PARAMETERS:
   * - props (EventContextCardProps): Props containing event details and project identifier.
   *
   * RETURNS:
   * - React.JSX.Element: The event context card UI block.
   */
  const cleanProjectId = (projectId ?? '').slice(0, 8).toUpperCase()

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5`}>
      <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block">
        EVENT CONTEXT
      </span>
      
      {event?.id ? (
        <Link
          href={`/events/${event.id}`}
          className="text-sm font-mono font-bold text-[#e8e1df] hover:text-[#00e0b3] transition-colors uppercase tracking-wide"
        >
          {event.title || "Unknown Event"}
        </Link>
      ) : (
        <span className="text-sm font-mono font-bold text-[#e8e1df] uppercase tracking-wide">
          Unknown Event
        </span>
      )}

      {/* Event Status tag */}
      <div className="flex select-none">
        <span className={`px-2 py-0.5 border ${
          event?.status === EVENT_STATUS.ONGOING
            ? "border-green-500/30 bg-green-500/10 text-green-400"
            : "border-red-500/30 bg-red-500/10 text-red-400"
        } rounded-sm font-mono text-[8px] font-bold uppercase tracking-widest`}>
          {event?.status || "UNKNOWN"}
        </span>
      </div>

      {/* Schedule */}
      <div className="flex flex-col gap-1.5 font-mono text-[10px]">
        <span className="text-[#83958d] uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs">calendar_month</span>
          <span>Schedule</span>
        </span>
        <span className="text-[#e8e1df] pl-5">
          {formatDate(event?.start_date || null)} — {formatDate(event?.end_date || null)}
        </span>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5 font-mono text-[10px]">
        <span className="text-[#83958d] uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-xs">location_on</span>
          <span>Location</span>
        </span>
        <span className="text-[#e8e1df] pl-5">
          {event?.location || "Main Campus Innovation Hub"}
        </span>
      </div>

      {/* Event Poster Image (increased height h-44) */}
      {event?.poster_path && (
        <div className="w-full h-44 relative bg-[#151312] border border-white/5 overflow-hidden rounded-sm mt-2">
          <Image
            src={handleGetUrl(supabase, event.poster_path)!}
            alt="Event Poster"
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        </div>
      )}

      {/* Project Registry ID footer */}
      <div className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider text-center pt-4 border-t border-white/5 mt-2">
        Project Registry ID: #ITEE-SPOT-{cleanProjectId}
      </div>
    </div>
  )
}
