'use client'

import { tw } from "@/app/constants/design-tokens"
import { motion } from "framer-motion"

interface EventsSidebarProp {
  selectedStatuses: string[]
  onStatusToggle: (status: string) => void
  selectedSchedule: string
  onScheduleChange: (schedule: string) => void
  selectedAvailability: string | null
  onAvailabilityChange: (availability: string | null) => void
}

/**
 * PURPOSE:
 * This component renders the left-hand filters sidebar for the events listing.
 * It allows the user to filter events by active/closed status, date ranges, and availability
 * button tags. It also features a decorative Node Uptime progress bar.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'EventsClient.tsx' and placed in 'app/events/components/EventsSidebar.tsx'
 * to modularize the sidebar query filters.
 *
 * INPUTS / PARAMETERS:
 * - selectedStatuses (string[], Required): Array of currently checked event statuses.
 * - onStatusToggle ((status: string) => void, Required): Callback to toggle checked status.
 * - selectedSchedule (string, Required): The currently selected schedule range key.
 * - onScheduleChange ((schedule: string) => void, Required): Callback when dropdown changes.
 * - selectedAvailability (string | null, Required): The active availability button choice.
 * - onAvailabilityChange ((availability: string | null) => void, Required): Callback to toggle availability tag.
 */
export default function EventsSidebar({
  selectedStatuses,
  onStatusToggle,
  selectedSchedule,
  onScheduleChange,
  selectedAvailability,
  onAvailabilityChange
}: EventsSidebarProp) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="lg:col-span-3 flex flex-col gap-6"
    >
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border p-6 rounded-sm flex flex-col gap-6`}>
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
          <span className="material-symbols-outlined text-xs text-[#00e0b3]">
            filter_list
          </span>
        </div>

        {/* STATUS Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#83958d] mb-3 block">
            Status
          </label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group text-sm select-none">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("ongoing")}
                onChange={() => onStatusToggle("ongoing")}
                className="w-4 h-4 border border-[#3a4a44] bg-[#151312] text-[#00e0b3] rounded-sm focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00e0b3]"
              />
              <span className={`${selectedStatuses.includes("ongoing") ? "text-[#00e0b3]" : "text-[#b9cbc2]"} group-hover:text-[#00e0b3] transition-colors`}>
                Ongoing
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group text-sm select-none">
              <input
                type="checkbox"
                checked={selectedStatuses.includes("finished")}
                onChange={() => onStatusToggle("finished")}
                className="w-4 h-4 border border-[#3a4a44] bg-[#151312] text-[#00e0b3] rounded-sm focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00e0b3]"
              />
              <span className={`${selectedStatuses.includes("finished") ? "text-[#00e0b3]" : "text-[#b9cbc2]"} group-hover:text-[#00e0b3] transition-colors`}>
                Finished
              </span>
            </label>
          </div>
        </div>

        {/* SCHEDULE Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#83958d] mb-3 block">
            Schedule
          </label>
          <select
            value={selectedSchedule}
            onChange={(e) => onScheduleChange(e.target.value)}
            className="w-full bg-[#151312] border border-white/10 rounded-sm text-[#e8e1df] py-2 px-3 text-xs font-mono focus:border-[#00e0b3] focus:ring-0 cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past Dates</option>
          </select>
        </div>

        {/* AVAILABILITY Filter */}
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#83958d] mb-3 block">
            Availability
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "open", label: "Open" },
              { id: "waitlist", label: "Waitlist" },
              { id: "invite", label: "Invite Only" }
            ].map((tag) => {
              const isActive = selectedAvailability === tag.id
              return (
                <button
                  key={tag.id}
                  onClick={() => onAvailabilityChange(isActive ? null : tag.id)}
                  className={`text-[9px] font-mono uppercase tracking-wider py-1 px-3 border rounded-sm transition-all duration-300 ${
                    isActive
                      ? "border-[#00e0b3] text-[#00e0b3] bg-[#00e0b3]/10"
                      : "border-white/5 text-[#83958d] bg-white/5 hover:border-[#83958d]/30"
                  }`}
                >
                  {tag.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Node Uptime */}
        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-[#83958d] mb-2">
            <span>Node_Uptime</span>
            <span className="text-[#00e0b3]">99.9%</span>
          </div>
          <div className="w-full h-1 bg-[#151312] rounded-sm overflow-hidden border border-white/5">
            <div className="h-full bg-[#00e0b3] w-[99.9%] rounded-sm"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
