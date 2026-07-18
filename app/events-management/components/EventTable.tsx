/**
 * PURPOSE:
 * Renders the interactive database table for the Event Management portal.
 * Displays paginated event rows with index, title, ID, status select, registration status select,
 * formatted created_at date, and direct navigation links to event edit routes.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/events-management/EventManagementClient.tsx' using 'refactor-skill'
 * to isolate table presentation and inline status update triggers.
 *
 * INPUTS / PARAMETERS:
 * - paginatedEvents (Array<EventInsert>, Required): Slice of event records for current page view.
 * - startIndex (number, Required): Index offset for calculating continuous row numbers.
 * - handleStatusChange ((eventId: string, newStatus: EVENT_STATUS) => Promise<void>, Required): Event status change handler.
 * - handleRegistrationStatusChange ((eventId: string, newRegStatus: EVENT_STATUS) => Promise<void>, Required): Registration status change handler.
 */

'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { EventInsert } from "@/app/types/event"
import { EVENT_STATUS } from "@/app/types/enum"
import { tw } from "@/app/constants/design-tokens"

interface EventTableProps {
  paginatedEvents: Array<EventInsert>
  startIndex: number
  handleStatusChange: (eventId: string, newStatus: EVENT_STATUS) => Promise<void>
  handleRegistrationStatusChange: (eventId: string, newRegStatus: EVENT_STATUS) => Promise<void>
}

export default function EventTable({
  paginatedEvents,
  startIndex,
  handleStatusChange,
  handleRegistrationStatusChange,
}: EventTableProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Parses ISO date string into short uppercase date representation.
   *
   * PARAMETERS:
   * - dateStr (string | null | undefined): Raw ISO date string.
   *
   * RETURNS:
   * - string: Formatted date string or 'N/A'.
   */
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "N/A"
    return new Date(dateStr)
      .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
      .toUpperCase()
  }

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-x-auto`}>
      <table className="w-full text-left border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-[#151312] text-[#83958d] uppercase tracking-widest text-[9px]">
            <th className="py-3.5 px-4 font-bold">#</th>
            <th className="py-3.5 px-4 font-bold">Event Title</th>
            <th className="py-3.5 px-4 font-bold">Event Status</th>
            <th className="py-3.5 px-4 font-bold">Registration Status</th>
            <th className="py-3.5 px-4 font-bold">Created At</th>
            <th className="py-3.5 px-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {paginatedEvents.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-[#83958d] uppercase tracking-wider">
                NO_EVENTS_FOUND
              </td>
            </tr>
          ) : (
            paginatedEvents.map((event, idx) => {
              const isEventOngoing = event.status === EVENT_STATUS.ONGOING
              const isRegOngoing = event.registration_status === EVENT_STATUS.ONGOING

              return (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: idx * 0.02 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  {/* Index */}
                  <td className="py-4 px-4 text-[#83958d] font-mono text-[10px]">
                    {String(startIndex + idx + 1).padStart(2, "0")}
                  </td>

                  {/* Title */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[#e8e1df] hover:text-[#00e0b3] transition-colors line-clamp-1">
                        {event.title || "Untitled Event"}
                      </span>
                      <span className="text-[9px] text-[#83958d]">
                        ID: {event.id ? `${event.id.slice(0, 8)}...` : "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Event Status Dropdown */}
                  <td className="py-4 px-4">
                    <select
                      value={event.status ?? EVENT_STATUS.ONGOING}
                      onChange={(e) =>
                        handleStatusChange(event.id!, e.target.value as EVENT_STATUS)
                      }
                      className={`bg-[#151312] border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider py-1.5 px-2.5 rounded-sm focus:outline-none cursor-pointer ${
                        isEventOngoing
                          ? "text-[#00e0b3] border-[#00e0b3]/30"
                          : "text-[#83958d] border-white/10"
                      }`}
                    >
                      <option value={EVENT_STATUS.ONGOING}>Ongoing</option>
                      <option value={EVENT_STATUS.FINISHED}>Finished</option>
                    </select>
                  </td>

                  {/* Registration Status Dropdown */}
                  <td className="py-4 px-4">
                    <select
                      value={event.registration_status ?? EVENT_STATUS.ONGOING}
                      onChange={(e) =>
                        handleRegistrationStatusChange(
                          event.id!,
                          e.target.value as EVENT_STATUS
                        )
                      }
                      className={`bg-[#151312] border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider py-1.5 px-2.5 rounded-sm focus:outline-none cursor-pointer ${
                        isRegOngoing
                          ? "text-[#00e0b3] border-[#00e0b3]/30"
                          : "text-[#83958d] border-white/10"
                      }`}
                    >
                      <option value={EVENT_STATUS.ONGOING}>Ongoing</option>
                      <option value={EVENT_STATUS.FINISHED}>Finished</option>
                    </select>
                  </td>

                  {/* Created At */}
                  <td className="py-4 px-4 text-[#83958d] text-[10px] whitespace-nowrap">
                    {formatDate(event.created_at)}
                  </td>

                  {/* Action Edit Button */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="inline-flex items-center gap-1.5 border border-[#00e0b3]/30 text-[#00e0b3] hover:bg-[#00e0b3]/10 font-mono text-[9px] uppercase font-bold px-3 py-1.5 rounded-sm tracking-wider transition-all"
                    >
                      <span className="material-symbols-outlined text-xs">edit</span>
                      <span>Edit</span>
                    </Link>
                  </td>
                </motion.tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
