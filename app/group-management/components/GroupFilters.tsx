/**
 * PURPOSE:
 * Renders the search bar and filter controls for the Group Management Dashboard,
 * including text search, event selection, and creation date sorting.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/group-management/GroupManagementClient.tsx' to isolate filter layout and states.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current search query value.
 * - setSearchQuery ((query: string) => void, Required): State setter for search query.
 * - eventFilter (string, Required): Selected event filter value.
 * - setEventFilter ((event: string) => void, Required): State setter for event filter.
 * - sortOrder ("desc" | "asc", Required): Active creation date sort direction.
 * - setSortOrder ((sort: "desc" | "asc") => void, Required): State setter for sort order.
 * - uniqueEvents (string[], Required): Array of unique event titles for the filter dropdown.
 * - setCurrentPage ((page: number) => void, Required): State setter for resetting active pagination page.
 */

'use client'

import React from "react"
import { tw } from "@/app/constants/design-tokens"

interface GroupFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  eventFilter: string
  setEventFilter: (event: string) => void
  sortOrder: "desc" | "asc"
  setSortOrder: (sort: "desc" | "asc") => void
  uniqueEvents: string[]
  setCurrentPage: (page: number) => void
}

export default function GroupFilters({
  searchQuery,
  setSearchQuery,
  eventFilter,
  setEventFilter,
  sortOrder,
  setSortOrder,
  uniqueEvents,
  setCurrentPage,
}: GroupFiltersProps) {

  /**
   * BEHAVIORAL MECHANISM:
   * Handles user input in the search field, updating search state and resetting pagination.
   *
   * PARAMETERS:
   * - val (string): Search query string.
   *
   * RETURNS:
   * - void
   */
  const handleSearchChange = (val: string): void => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles selection changes in the event filter dropdown and resets pagination.
   *
   * PARAMETERS:
   * - val (string): Selected event title.
   *
   * RETURNS:
   * - void
   */
  const handleEventChange = (val: string): void => {
    setEventFilter(val)
    setCurrentPage(1)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles selection changes in the sort order dropdown and resets pagination.
   *
   * PARAMETERS:
   * - val ("desc" | "asc"): Selected sort direction.
   *
   * RETURNS:
   * - void
   */
  const handleSortChange = (val: "desc" | "asc"): void => {
    setSortOrder(val)
    setCurrentPage(1)
  }

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5 select-none`}>
      
      {/* Top: Search Bar */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          SEARCH GROUP NAME / DESCRIPTION
        </span>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search group name or summary..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs pl-10 pr-3 py-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
          />
          <span className="material-symbols-outlined absolute left-3 text-xs text-[#83958d] pointer-events-none">
            search
          </span>
        </div>
      </div>

      {/* Bottom: Event & Created_at Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        
        {/* Event Filter dropdown */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            FILTER BY EVENT
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={eventFilter}
              onChange={(e) => handleEventChange(e.target.value)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
            >
              <option value="">ALL EVENTS</option>
              {uniqueEvents.map((eventTitle) => (
                <option key={eventTitle} value={eventTitle}>
                  {eventTitle.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

        {/* Created At Sort dropdown */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            SORT BY CREATED DATE
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value as "desc" | "asc")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
            >
              <option value="desc">NEWEST CREATED (DESCENDING)</option>
              <option value="asc">OLDEST CREATED (ASCENDING)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}
