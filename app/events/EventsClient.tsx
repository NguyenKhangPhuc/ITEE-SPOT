'use client'

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { EVENT_STATUS } from "../types/enum"
import { EventInsert } from "../types/event"
import { createClient } from "../utils/supabase/client"
import EventsHeader from "./components/EventsHeader"
import EventsSidebar from "./components/EventsSidebar"
import EventCard from "./components/Event"
import Pagination from "../helpers/Pagination"
import { tw } from "../constants/design-tokens"
import BackButton from "../components/BackButton"

/**
 * PURPOSE:
 * This component is the primary client-side controller for the events module. It handles
 * filtering events by status and dates, sorting by date, rendering the grid of event cards,
 * and paginating the results.
 *
 * CONTEXT/PARENT FILE:
 * Located at 'app/events/EventsClient.tsx' alongside 'page.tsx', orchestrating the events UI.
 *
 * INPUTS / PARAMETERS:
 * - events (EventInsert[], Required): The raw database events retrieved on the server.
 */
export default function EventsClient({ events }: { events: EventInsert[] }) {
  const supabase = createClient()

  // Filter States
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<string>("all")
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null)
  
  // Sorting State
  const [sortBy, setSortBy] = useState<string>("date_desc")

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 4

  /**
   * BEHAVIORAL MECHANISM:
   * Generates public URLs for uploaded media files in Supabase storage attachments bucket.
   *
   * PARAMETERS:
   * - imagePath (string): Storage path for the poster asset.
   *
   * RETURNS:
   * - string: Fully qualified public asset URL.
   */
  const handleGetUrl = (imagePath: string): string => {
    const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath)
    return data.publicUrl
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Toggles checkboxes inside the filter sidebar.
   *
   * PARAMETERS:
   * - status (string): The status value to toggle.
   *
   * RETURNS:
   * - void
   */
  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
    setCurrentPage(1)
  }

  // Filtered and Sorted Events
  const processedEvents = useMemo(() => {
    let result = events.filter((event) => {
      // 1. Status Filter
      if (selectedStatuses.length > 0) {
        const matchesStatus = event.status && selectedStatuses.includes(event.status.toLowerCase())
        if (!matchesStatus) return false
      }

      // 2. Schedule Filter (Date matching)
      if (selectedSchedule !== "all" && event.start_date) {
        const startDate = new Date(event.start_date)
        const now = new Date()

        // Calculate start of current week
        const startOfWeek = new Date(now)
        const day = now.getDay()
        const diff = now.getDate() - day + (day === 0 ? -6 : 1)
        startOfWeek.setDate(diff)
        startOfWeek.setHours(0, 0, 0, 0)

        // Calculate end of current week
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        endOfWeek.setHours(23, 59, 59, 999)

        // Calculate start and end of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

        if (selectedSchedule === "week") {
          if (startDate < startOfWeek || startDate > endOfWeek) return false
        } else if (selectedSchedule === "month") {
          if (startDate < startOfMonth || startDate > endOfMonth) return false
        } else if (selectedSchedule === "past") {
          if (startDate >= now) return false
        } else if (selectedSchedule === "upcoming") {
          if (startDate < now) return false
        }
      }

      // 3. Availability Filter
      if (selectedAvailability) {
        if (selectedAvailability === "open") {
          if (event.status !== EVENT_STATUS.ONGOING) return false
        } else if (selectedAvailability === "invite") {
          if (event.status !== EVENT_STATUS.FINISHED) return false
        } else if (selectedAvailability === "waitlist") {
          return false // Waitlist has no matching database records
        }
      }

      return true
    })

    // Apply Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "date_desc") {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
        return dateB - dateA
      } else if (sortBy === "date_asc") {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
        return dateA - dateB
      } else if (sortBy === "title_asc") {
        const titleA = a.title || ""
        const titleB = b.title || ""
        return titleA.localeCompare(titleB)
      }
      return 0
    })

    return result
  }, [events, selectedStatuses, selectedSchedule, selectedAvailability, sortBy])

  // Paginated Events
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return processedEvents.slice(startIndex, startIndex + itemsPerPage)
  }, [processedEvents, currentPage])

  const totalPages = Math.ceil(processedEvents.length / itemsPerPage)

  return (
    <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-montserrat overflow-x-hidden py-24 px-6 md:px-16`}>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto">
        <BackButton />
      </div>

      {/* Title Banner */}
      <EventsHeader />

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Filters Sidebar */}
        <EventsSidebar
          selectedStatuses={selectedStatuses}
          onStatusToggle={handleStatusToggle}
          selectedSchedule={selectedSchedule}
          onScheduleChange={setSelectedSchedule}
          selectedAvailability={selectedAvailability}
          onAvailabilityChange={setSelectedAvailability}
        />

        {/* Right Results Listing Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-9"
        >
          {/* Header metadata and sorting controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-white/5">
            <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider">
              Results: {processedEvents.length} Entries Found
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-transparent border-0 text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-wider py-0 pl-1 pr-6 focus:ring-0 focus:border-0 cursor-pointer"
              >
                <option value="date_desc" className="bg-[#1d1b1a] text-[#e8e1df]">Date_Desc</option>
                <option value="date_asc" className="bg-[#1d1b1a] text-[#e8e1df]">Date_Asc</option>
                <option value="title_asc" className="bg-[#1d1b1a] text-[#e8e1df]">Title_Asc</option>
              </select>
            </div>
          </div>

          {/* Dynamic Listing Grid */}
          {paginatedEvents.length === 0 ? (
            <div className="text-center py-24 text-[#b9cbc2] font-mono text-sm uppercase">
              no information
            </div>
          ) : (
            <motion.div
              key={`page-${currentPage}-${sortBy}`}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {paginatedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  handleGetUrl={handleGetUrl}
                />
              ))}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
