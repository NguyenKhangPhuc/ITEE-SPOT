/**
 * PURPOSE:
 * Client Component acting as the primary controller for the Event Management portal.
 * Manages filter queries, sorting orders, pagination state, and server action updates for events.
 * Renders decomposed EventFilters and EventTable child components.
 *
 * CONTEXT/PARENT FILE:
 * Mounted inside 'app/events-management/page.tsx'.
 * Refactored using 'refactor-skill' guidelines to decompose monolithic architecture into modular components.
 *
 * INPUTS / PARAMETERS:
 * - events (Array<EventInsert>, Required): Initial array of event records retrieved from database.
 */

'use client'

import { useState } from "react"
import { EventInsert } from "@/app/types/event"
import { EVENT_STATUS } from "@/app/types/enum"
import { updateEventStatus, updateEventRegistrationStatus } from "@/app/actions/events"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import BackButton from "@/app/components/BackButton"
import Pagination from "@/app/helpers/Pagination"
import EventFilters from "./components/EventFilters"
import EventTable from "./components/EventTable"

interface EventManagementClientProps {
  events: Array<EventInsert>
}

const ITEMS_PER_PAGE = 20

type SortKey = "date_desc" | "date_asc"

export default function EventManagementClient({ events: initialEvents }: EventManagementClientProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const [events, setEvents] = useState<Array<EventInsert>>(initialEvents)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [regStatusFilter, setRegStatusFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortKey>("date_desc")
  const [currentPage, setCurrentPage] = useState<number>(1)

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers the updateEventStatus server action and updates local events state array on success.
   *
   * PARAMETERS:
   * - eventId (string): Database ID of the target event.
   * - newStatus (EVENT_STATUS): New event status enum choice.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleStatusChange = async (eventId: string, newStatus: EVENT_STATUS): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await updateEventStatus(eventId, newStatus)
      if (error) {
        throw new Error(error)
      }
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      )
      showNotification("Event status updated successfully.")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to update event status.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers the updateEventRegistrationStatus server action and updates local events state array on success.
   *
   * PARAMETERS:
   * - eventId (string): Database ID of the target event.
   * - newRegStatus (EVENT_STATUS): New registration status enum choice.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleRegistrationStatusChange = async (
    eventId: string,
    newRegStatus: EVENT_STATUS
  ): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await updateEventRegistrationStatus(eventId, newRegStatus)
      if (error) {
        throw new Error(error)
      }
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, registration_status: newRegStatus } : event
        )
      )
      showNotification("Registration status updated successfully.")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to update registration status.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  // 1. Filter events by title/description search query, event status, and registration status
  const filteredEvents = events
    .filter((event) => {
      const titleStr = event.title?.toLowerCase() ?? ""
      const descStr = event.short_description?.toLowerCase() ?? ""
      const query = searchQuery.toLowerCase()
      return titleStr.includes(query) || descStr.includes(query)
    })
    .filter((event) => {
      if (!statusFilter) return true
      return event.status?.toLowerCase() === statusFilter.toLowerCase()
    })
    .filter((event) => {
      if (!regStatusFilter) return true
      return event.registration_status?.toLowerCase() === regStatusFilter.toLowerCase()
    })

  // 2. Sort events by created_at date (date_desc vs date_asc)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0

    if (sortBy === "date_desc") {
      return timeB - timeA
    } else {
      return timeA - timeB
    }
  })

  // 3. Paginate filtered/sorted events (20 per page)
  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  /**
   * BEHAVIORAL MECHANISM:
   * Handles page changes, verifying range validity.
   *
   * PARAMETERS:
   * - page (number): Target page choice.
   *
   * RETURNS:
   * - void
   */
  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Back Button */}
      <BackButton />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
        <div className="flex gap-4 items-stretch">
          <div className="w-[3px] bg-[#00e0b3]" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              SYSTEM_PORTAL // EVENT_CONTROLLER
            </span>
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              EVENT_MANAGEMENT
            </h1>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [CONTROL_NODE_ACTIVE]
        </div>
      </div>

      {/* Decomposed Event Filters component */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        regStatusFilter={regStatusFilter}
        setRegStatusFilter={setRegStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setCurrentPage={setCurrentPage}
      />

      {/* Events Database Table Section */}
      <div className="flex flex-col gap-4">
        {/* Table Metrics */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00e0b3]" />
            <span>01_EVENT_REGISTRY_DATABASE</span>
          </div>
          <span className="font-mono text-[9px] text-[#83958d]">
            TOTAL_EVENTS: {sortedEvents.length}
          </span>
        </div>

        {/* Decomposed Event Table component */}
        <EventTable
          paginatedEvents={paginatedEvents}
          startIndex={startIndex}
          handleStatusChange={handleStatusChange}
          handleRegistrationStatusChange={handleRegistrationStatusChange}
        />

        {/* Dynamic Pagination helper */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
