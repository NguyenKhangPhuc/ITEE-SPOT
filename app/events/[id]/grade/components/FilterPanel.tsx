/**
 * PURPOSE:
 * Renders the filter controls panel including search input, quick filter buttons,
 * star rating select dropdown, and sorting order toggle button.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of EventResultClient.tsx, located at 'app/events/[id]/grade/components/FilterPanel.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - filterMode (FilterMode, Required): Currently active quick filter mode.
 * - setFilterMode ((mode: FilterMode) => void, Required): State setter for filter mode.
 * - starRating (number | "", Required): Currently selected star rating filter value.
 * - setStarRating ((rating: number | "") => void, Required): State setter for star rating filter.
 * - searchQuery (string, Required): Current search query string.
 * - setSearchQuery ((query: string) => void, Required): State setter for search query.
 * - sortOrder ("desc" | "asc", Required): Current sorting order direction.
 * - setSortOrder ((order: "desc" | "asc") => void, Required): State setter for sorting order.
 */

'use client'

import { tw } from "@/app/constants/design-tokens"

type FilterMode = "all" | "top5"

interface FilterPanelProps {
  filterMode: FilterMode
  setFilterMode: (mode: FilterMode) => void
  starRating: number | ""
  setStarRating: (rating: number | "") => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortOrder: "desc" | "asc"
  setSortOrder: (order: "desc" | "asc") => void
}

export default function FilterPanel({
  filterMode,
  setFilterMode,
  starRating,
  setStarRating,
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
}: FilterPanelProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Handles resetting the filterMode state when a star rating filter is chosen.
   *
   * PARAMETERS:
   * - val (string): The string rating value from the HTML select option.
   *
   * RETURNS:
   * - void
   */
  const handleRatingChange = (val: string) => {
    setStarRating(val !== "" ? Number(val) : "")
    setFilterMode("all")
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Toggles the sortOrder state between ascending and descending.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleSortToggle = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-5 flex flex-col gap-4 select-none`}>
      <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
        FILTER_NODE_TELEMETRY
      </span>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Quick Buttons row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setFilterMode("all")
              setStarRating("")
            }}
            className={`px-4 py-2 font-mono text-[9px] font-bold tracking-wider uppercase rounded-sm border transition-all cursor-pointer ${
              filterMode === "all" && starRating === ""
                ? "bg-[#00e0b3] text-[#00382b] border-[#00e0b3]"
                : "border-white/5 text-[#b9cbc2] hover:bg-white/5"
            }`}
          >
            ALL PROJECTS RESULT
          </button>

          <button
            onClick={() => {
              setFilterMode("top5")
              setStarRating("")
            }}
            className={`px-4 py-2 font-mono text-[9px] font-bold tracking-wider uppercase rounded-sm border transition-all cursor-pointer ${
              filterMode === "top5"
                ? "bg-[#00e0b3] text-[#00382b] border-[#00e0b3]"
                : "border-white/5 text-[#b9cbc2] hover:bg-white/5"
            }`}
          >
            TOP 5 HIGHEST
          </button>

          {/* Ascending / Descending Toggle */}
          <button
            onClick={handleSortToggle}
            className="px-4 py-2 font-mono text-[9px] font-bold tracking-wider uppercase rounded-sm border transition-all cursor-pointer hover:bg-white/5 flex items-center gap-1.5 transition-all cursor-pointer select-none"
          >
            <span className="material-symbols-outlined text-[10px]">
              {sortOrder === "desc" ? "arrow_downward" : "arrow_upward"}
            </span>
            SORT: {sortOrder === "desc" ? "DESC" : "ASC"}
          </button>
        </div>

        {/* Search and Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Real-time search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-[10px] p-2.5 pl-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full sm:w-48"
            />
            <span className="material-symbols-outlined absolute left-2.5 text-xs text-[#83958d] pointer-events-none">
              search
            </span>
          </div>

          {/* Star Rating select */}
          <div className="relative flex items-center select-none">
            <select
              value={starRating}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-[10px] p-2.5 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors appearance-none cursor-pointer w-full sm:w-44"
            >
              <option value="">RATING_STARS (YOURS)</option>
              <option value="5">[ 5 STARS ]</option>
              <option value="4">[ 4 STARS ]</option>
              <option value="3">[ 3 STARS ]</option>
              <option value="2">[ 2 STARS ]</option>
              <option value="1">[ 1 STAR ]</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
