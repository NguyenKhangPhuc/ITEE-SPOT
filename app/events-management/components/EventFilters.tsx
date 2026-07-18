/**
 * PURPOSE:
 * Renders the search bar and horizontal query filter controls for the Event Management portal.
 * Handles input bindings for title/description text search, event status filtering,
 * registration status filtering, and created_at date sorting.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/events-management/EventManagementClient.tsx' using 'refactor-skill'
 * to isolate filter presentation controls.
 *
 * INPUTS / PARAMETERS:
 * - searchQuery (string, Required): Current title/description search query.
 * - setSearchQuery ((query: string) => void, Required): Callback to update search query state.
 * - statusFilter (string, Required): Current event status filter value.
 * - setStatusFilter ((status: string) => void, Required): Callback to update event status filter state.
 * - regStatusFilter (string, Required): Current registration status filter value.
 * - setRegStatusFilter ((status: string) => void, Required): Callback to update registration status filter state.
 * - sortBy ('date_desc' | 'date_asc', Required): Current sorting selection.
 * - setSortBy ((sort: 'date_desc' | 'date_asc') => void, Required): Callback to update sort order state.
 * - setCurrentPage ((page: number) => void, Required): Callback to reset current pagination index.
 */

'use client'

interface EventFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  regStatusFilter: string
  setRegStatusFilter: (status: string) => void
  sortBy: "date_desc" | "date_asc"
  setSortBy: (sort: "date_desc" | "date_asc") => void
  setCurrentPage: (page: number) => void
}

export default function EventFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  regStatusFilter,
  setRegStatusFilter,
  sortBy,
  setSortBy,
  setCurrentPage,
}: EventFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar on Top */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#83958d]">
          search
        </span>
        <input
          type="text"
          placeholder="Search events by title or description..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full bg-[#151312] border border-white/10 rounded-sm pl-10 pr-4 py-3 text-xs font-mono text-[#e8e1df] placeholder-[#83958d]/50 focus:border-[#00e0b3] focus:outline-none transition-all"
        />
      </div>

      {/* Horizontal Filters Row Below Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1a1817] border border-white/5 p-4 rounded-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Event Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider">
              Event Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-[#151312] border border-white/10 text-[#00e0b3] font-mono text-xs py-1.5 px-3 rounded-sm focus:border-[#00e0b3] focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          {/* Registration Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider">
              Registration Status:
            </span>
            <select
              value={regStatusFilter}
              onChange={(e) => {
                setRegStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-[#151312] border border-white/10 text-[#00e0b3] font-mono text-xs py-1.5 px-3 rounded-sm focus:border-[#00e0b3] focus:outline-none cursor-pointer"
            >
              <option value="">All Reg Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </select>
          </div>
        </div>

        {/* Date Sorting Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider">
            Sort By Created:
          </span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "date_desc" | "date_asc")
              setCurrentPage(1)
            }}
            className="bg-[#151312] border border-white/10 text-[#00e0b3] font-mono text-xs py-1.5 px-3 rounded-sm focus:border-[#00e0b3] focus:outline-none cursor-pointer"
          >
            <option value="date_desc">Newest First (Date Desc)</option>
            <option value="date_asc">Oldest First (Date Asc)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
