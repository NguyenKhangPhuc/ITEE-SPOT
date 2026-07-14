'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { EVENT_STATUS, PROFILE_ROLE } from "@/app/types/enum"
import { Event } from "@/app/types/event"
import { Profile } from "@/app/types/profile"
import { tw } from "@/app/constants/design-tokens"

interface EventSidebarProps {
  event: Event
  user: Profile
  fmtDate: (dateStr: string | null | undefined) => string
  fmtTime: (dateStr: string | null | undefined) => string
}

/**
 * PURPOSE:
 * Renders the right-hand Technical Specification sidebar for a single event detail page.
 * It displays a structured mono-label metadata panel (status, capacity, execution timeline,
 * organized date/time) and a set of role-gated action buttons.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/events/[id]/SingleEventClient.tsx' and placed in
 * 'app/events/[id]/components/EventSidebar.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): The full event record.
 * - user (Profile, Required): The currently authenticated user profile, used for role-gating buttons.
 * - fmtDate ((dateStr: string | null | undefined) => string, Required): Shared date formatter callback.
 * - fmtTime ((dateStr: string | null | undefined) => string, Required): Shared time formatter callback.
 */
export default function EventSidebar({ event, user, fmtDate, fmtTime }: EventSidebarProps) {
  const isOngoing = event.status === EVENT_STATUS.ONGOING
  const isAdminOrJudge = user?.role === PROFILE_ROLE.JUDGES || user?.role === PROFILE_ROLE.ADMIN

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
      className="lg:col-span-5 flex flex-col gap-6"
    >
      {/* Technical Specification Panel */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <span className="text-xs font-mono font-bold uppercase tracking-widest">
            Technical Specification
          </span>
          <span className="material-symbols-outlined text-xs text-[#00e0b3]">settings</span>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Status and Capacity row */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                Status
              </span>
              <span className={`text-[11px] font-mono font-bold ${isOngoing ? 'text-[#00e0b3]' : 'text-[#83958d]'}`}>
                {event.status?.toUpperCase() ?? 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
                Max_Capacity
              </span>
              <span className="text-[11px] font-mono font-bold text-[#00e0b3]">
                {event.max_group_members
                  ? `${event.max_group_members} members / group`
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* Execution Timeline */}
          <div>
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-3">
              Execution_Timeline
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#83958d]">START:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">{fmtDate(event.start_date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#83958d]">END:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">{fmtDate(event.end_date)}</span>
              </div>
            </div>
          </div>

          {/* Organized Date and Time */}
          <div className="pt-4 border-t border-white/5">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider block mb-3">
              Organized_Datetime
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#83958d]">DATE:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">{fmtDate(event.organized_date?.toString())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-[#83958d]">TIME:</span>
                <span className="text-[10px] font-mono text-[#b9cbc2]">{fmtTime(event.organized_date?.toString())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* JUDGES / ADMIN only actions */}
        {isAdminOrJudge && (
          <>
            <Link
              href={`/events/${event.id}/groups`}
              className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border text-[#b9cbc2] hover:border-[#00e0b3]/30 hover:text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest py-3 text-center transition-all duration-300 rounded-sm`}
            >
              View All Groups
            </Link>
            <Link
              href={`/events/${event.id}/grade`}
              className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border text-[#b9cbc2] hover:border-[#00e0b3]/30 hover:text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest py-3 text-center transition-all duration-300 rounded-sm`}
            >
              Results Overview
            </Link>
          </>
        )}

        {/* Register / Locked — visible to all */}
        {isOngoing ? (
          <Link
            href={`/register/${event.id}`}
            className="border border-[#00e0b3] text-[#00e0b3] hover:bg-[#00e0b3] hover:text-[#00382b] font-mono text-[10px] uppercase font-bold tracking-widest py-3 text-center transition-all duration-300 rounded-sm"
          >
            Initialize Application
          </Link>
        ) : (
          <div className="border border-white/5 text-[#83958d] bg-[#151312]/20 text-center font-mono text-[10px] uppercase font-bold py-3 w-full tracking-widest rounded-sm cursor-not-allowed">
            Registration Locked
          </div>
        )}
      </div>
    </motion.div>
  )
}
