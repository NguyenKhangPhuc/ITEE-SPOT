'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { EventWithChallenges } from "@/app/types/event"
import { UnifiedGroup, Filter } from "@/app/types/group"
import FilterComponent from "./FilterComponent"
import GroupsList from "@/app/components/groups/GroupsList"

interface EventGroupsClientProps {
  event: EventWithChallenges
  eventGroups: Array<UnifiedGroup> | null
}

/**
 * PURPOSE:
 * Client Component that orchestrates the Event Groups Registry dashboard. It houses the modal
 * filtering form state and logic, matching filtered groups on challenges, degrees, and academic
 * programmes, and forwards the filtered list to the shared GroupsList component.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/events/[id]/groups/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (EventWithChallenges, Required): Event metadata containing its challenge details.
 * - eventGroups (Array<UnifiedGroup> | null, Required): List of all groups registered for the event.
 */
export default function EventGroupsClient({ event, eventGroups }: EventGroupsClientProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [groups, setGroups] = useState<Array<UnifiedGroup>>(eventGroups || [])

  // React Hook Form for filters
  const { register, handleSubmit, reset } = useForm<Filter>({
    defaultValues: {
      challenges: [],
      programmes: [],
      degrees: [],
    },
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Handles filter form submissions. It filters the complete list of groups by comparing
   * selected challenge names, student degrees, and academic programmes.
   *
   * PARAMETERS:
   * - data (Filter): Form data from checkboxes.
   *
   * RETURNS:
   * - void
   */
  const onSubmit = (data: Filter) => {
    if (data.challenges.length === 0 && data.degrees.length === 0 && data.programmes.length === 0) {
      setGroups(eventGroups || [])
    } else {
      const filtered = (eventGroups || []).filter((group) => {
        const matchChallenge =
          data.challenges.length === 0
            ? true
            : group.challenges.some((c) => data.challenges.includes(c.event_challenges?.title ?? ""))

        const matchDegree =
          data.degrees.length === 0
            ? true
            : group.members.some((m) => data.degrees.includes(m.profiles?.degree ?? ""))

        const matchProgramme =
          data.programmes.length === 0
            ? true
            : group.members.some((m) => data.programmes.includes(m.profiles?.programme ?? ""))

        return matchChallenge && matchDegree && matchProgramme
      })

      setGroups(filtered)
    }
    setIsOpen(false)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Resets the filter form inputs and displays the original complete list of groups.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleResetFilter = () => {
    reset()
    setGroups(eventGroups || [])
    setIsOpen(false)
  }

  return (
    <div className="w-full flex flex-col gap-8 min-h-screen">
      {/* Title & Filter Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          {/* Registry Tagline */}
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#83958d] uppercase tracking-wider">
            <span className="px-1.5 py-0.5 border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm font-bold text-[8px]">
              REGISTRY V2.4.0
            </span>
          </div>

          {/* Page Heading */}
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase leading-tight font-mono">
            Event Groups <span className="text-[#00e0b3]">Registry</span>
          </h1>

          <p className="text-xs font-mono text-[#83958d] leading-relaxed">
            Live monitoring of registered collectives and project development cycles for{" "}
            <span className="text-[#e8e1df] font-semibold">{event.title}</span>.
          </p>
        </div>

        {/* Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="border border-[#e8e1df]/20 hover:border-[#00e0b3]/30 bg-[#151312] hover:bg-[#00e0b3]/5 text-[#e8e1df] hover:text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest px-6 py-3.5 transition-all duration-300 rounded-sm cursor-pointer flex items-center gap-2 self-start md:self-center"
        >
          <span className="material-symbols-outlined text-xs">filter_alt</span>
          <span>Filter Groups</span>
        </button>
      </div>

      {/* Filter Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <FilterComponent
            setIsOpen={setIsOpen}
            handleSubmit={handleSubmit}
            event={event}
            onSubmit={onSubmit}
            handleResetFilter={handleResetFilter}
            register={register}
          />
        </div>
      )}

      {/* Groups Grid with client pagination */}
      <GroupsList groups={groups} actionType="submission" />
    </div>
  )
}