/**
 * PURPOSE:
 * Renders the filter controls for the User Management Dashboard, including name/email search,
 * role, university, and programme filters, and sorting by name.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/user-management/UserManagementClient.tsx' to isolate filters layout and states.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current search query value.
 * - setSearchQuery (Function, Required): State setter for search query.
 * - roleFilter (PROFILE_ROLE | "", Required): Active role filter value.
 * - setRoleFilter (Function, Required): State setter for role filter.
 * - uniFilter (UNIVERSITY | "", Required): Active university filter value.
 * - setUniFilter (Function, Required): State setter for university filter.
 * - progFilter (PROGRAMME | "", Required): Active programme filter value.
 * - setProgFilter (Function, Required): State setter for programme filter.
 * - sortBy (string, Required): Active sorting configuration.
 * - setSortBy (Function, Required): State setter for sorting configuration.
 * - setCurrentPage (Function, Required): State setter for pagination page.
 */

'use client'

import React from "react"
import { PROFILE_ROLE, UNIVERSITY, PROGRAMME } from "@/app/types/enum"
import { tw } from "@/app/constants/design-tokens"

type SortKey = "name_asc" | "name_desc"

interface UserFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  roleFilter: PROFILE_ROLE | ""
  setRoleFilter: (role: PROFILE_ROLE | "") => void
  uniFilter: UNIVERSITY | ""
  setUniFilter: (uni: UNIVERSITY | "") => void
  progFilter: PROGRAMME | ""
  setProgFilter: (prog: PROGRAMME | "") => void
  sortBy: SortKey
  setSortBy: (sort: SortKey) => void
  setCurrentPage: (page: number) => void
}

export default function UserFilters({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  uniFilter,
  setUniFilter,
  progFilter,
  setProgFilter,
  sortBy,
  setSortBy,
  setCurrentPage,
}: UserFiltersProps) {

  /**
   * BEHAVIORAL MECHANISM:
   * Handles user interaction with search bar, updating local query states and resetting pagination page.
   *
   * PARAMETERS:
   * - val (string): The search query string input.
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
   * Handles role dropdown changes, updating active role filter states and resetting pagination page.
   *
   * PARAMETERS:
   * - val (PROFILE_ROLE | ""): Selected role filter.
   *
   * RETURNS:
   * - void
   */
  const handleRoleChange = (val: PROFILE_ROLE | ""): void => {
    setRoleFilter(val)
    setCurrentPage(1)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles university filter dropdown changes, updating active university states and resetting pagination page.
   *
   * PARAMETERS:
   * - val (UNIVERSITY | ""): Selected university filter.
   *
   * RETURNS:
   * - void
   */
  const handleUniChange = (val: UNIVERSITY | ""): void => {
    setUniFilter(val)
    setCurrentPage(1)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles programme filter dropdown changes, updating active programme states and resetting pagination page.
   *
   * PARAMETERS:
   * - val (PROGRAMME | ""): Selected programme filter.
   *
   * RETURNS:
   * - void
   */
  const handleProgChange = (val: PROGRAMME | ""): void => {
    setProgFilter(val)
    setCurrentPage(1)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles sort selector changes, updating active sorting states and resetting pagination page.
   *
   * PARAMETERS:
   * - val (SortKey): Selected sorting configuration key.
   *
   * RETURNS:
   * - void
   */
  const handleSortChange = (val: SortKey): void => {
    setSortBy(val)
    setCurrentPage(1)
  }

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5 select-none`}>
      
      {/* Top: Email/Name Search Bar */}
      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
          SEARCH NAME / EMAIL ADDR
        </span>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            autoComplete="off"
            placeholder="Search user profile..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs pl-10 pr-3 py-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
          />
          <span className="material-symbols-outlined absolute left-3 text-xs text-[#83958d] pointer-events-none">
            search
          </span>
        </div>
      </div>

      {/* Bottom: Filters Group in horizontal row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        
        {/* Role Filter dropdown */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            FILTER BY ROLE
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value as PROFILE_ROLE | "")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
            >
              <option value="">ALL ROLES</option>
              {Object.entries(PROFILE_ROLE).map(([key, val]) => (
                <option key={key} value={val}>
                  {key.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

        {/* University Filter dropdown */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            FILTER BY UNIVERSITY
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={uniFilter}
              onChange={(e) => handleUniChange(e.target.value as UNIVERSITY | "")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
            >
              <option value="">ALL UNIVERSITIES</option>
              {Object.entries(UNIVERSITY).map(([key, val]) => (
                <option key={key} value={val}>
                  {val.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

        {/* Programme Filter dropdown */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            FILTER BY PROGRAMME
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={progFilter}
              onChange={(e) => handleProgChange(e.target.value as PROGRAMME | "")}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer hover:border-[#00e0b3]/20"
            >
              <option value="">ALL PROGRAMMES</option>
              {Object.entries(PROGRAMME).map(([key, val]) => (
                <option key={key} value={val}>
                  {val.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

        {/* Sort selection dropdown */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
            SORT (FULL NAME)
          </span>
          <div className="relative flex items-center w-full">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
            >
              <option value="name_asc">A - Z (ASCENDING)</option>
              <option value="name_desc">Z - A (DESCENDING)</option>
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
