/**
 * PURPOSE:
 * Client Component representing the main Event Evaluation Results dashboard.
 * It manages active filters state, computed sorting states, maps placeholder titles,
 * and mounts modular subcomponents (FilterPanel, GeneralCriteriaTable, and SpecificCriteriaModules).
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/events/[id]/grade/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (EventInsert, Required): Single event record.
 * - eventCriteria (EventCriteriaInsert[], Required): Array of grading criteria.
 * - scores (SubmissionFinalScoresResponse, Required): Evaluated final scores database array.
 * - eventId (string, Required): Current event ID.
 * - user (User, Required): Authenticated user session record.
 */

'use client'

import { useState } from "react"
import { User } from "@supabase/supabase-js"
import { SubmissionFinalScoresResponse, SubmissionFinalScore } from "@/app/types/submission_final_score_view"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { CRITERIA_TYPE } from "@/app/types/enum"
import { EventInsert } from "@/app/types/event"
import BackButton from "@/app/components/BackButton"
import FilterPanel from "./components/FilterPanel"
import GeneralCriteriaTable from "./components/GeneralCriteriaTable"
import SpecificCriteriaModules from "./components/SpecificCriteriaModules"

interface EventResultClientProps {
  event: EventInsert
  eventCriteria: Array<EventCriteriaInsert>
  scores: SubmissionFinalScoresResponse
  eventId: string
  user: User
}

type FilterMode = "all" | "top5"

export default function EventResultClient({
  event,
  eventCriteria,
  scores,
  eventId,
  user,
}: EventResultClientProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [starRating, setStarRating] = useState<number | "">("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")

  const normalCriteria = eventCriteria.filter(c => c.type === CRITERIA_TYPE.NORMAL)
  const specificCriteria = eventCriteria.filter(c => c.type === CRITERIA_TYPE.SPECIFIC)

  /**
   * BEHAVIORAL MECHANISM:
   * Generates a clean technical project title placeholder based on the group name.
   *
   * PARAMETERS:
   * - groupName (string | null): The group name.
   *
   * RETURNS:
   * - string: Project title placeholder.
   */
  const getProjectNamePlaceholder = (groupName: string | null): string => {
    if (!groupName) return "Untethered Agent Node"
    return `${groupName} Project Engine`
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Returns total unique evaluators who graded normal or specific criteria.
   *
   * PARAMETERS:
   * - project (SubmissionFinalScore): Evaluation scores wrapper.
   *
   * RETURNS:
   * - number: Unique graders count.
   */
  const getUniqueGradersCount = (project: SubmissionFinalScore): number => {
    const uniqueGraders = new Set<string>()
    project.normal_criteria.forEach(cell => {
      cell.graders?.forEach(g => uniqueGraders.add(g.user_id))
    })
    project.specific_criteria.forEach(cell => {
      cell.graders?.forEach(g => uniqueGraders.add(g.user_id))
    })
    return uniqueGraders.size
  }

  // Filter base scores list (without top5 slice)
  let baseFilteredScores = [...scores]

  // Real-time Text Search
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase()
    baseFilteredScores = baseFilteredScores.filter(s =>
      s.group_name?.toLowerCase().includes(query)
    )
  }

  // No extra mode-based filtering needed as high/multi are removed

  // Rating-based filtering: ONLY rating star given by the current user
  if (starRating !== "") {
    baseFilteredScores = baseFilteredScores.filter(s => {
      const userRating = s.raters?.find(r => r.user_id === user.id)
      return userRating && Math.round(userRating.rating) === Number(starRating)
    })
  }

  // Now, construct the scores array for the general table
  let generalTableScores = [...baseFilteredScores]
  if (filterMode === "top5") {
    generalTableScores = generalTableScores
      .sort((a, b) => (b.final_avg_score || 0) - (a.final_avg_score || 0))
      .slice(0, 5)
  }

  // Apply final sorting to general table scores (default descending, toggleable to ascending)
  generalTableScores.sort((a, b) => {
    const scoreA = a.final_avg_score || 0
    const scoreB = b.final_avg_score || 0
    return sortOrder === "desc" ? scoreB - scoreA : scoreA - scoreB
  })

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Back button */}
      <BackButton />

      {/* Header Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
        <div className="flex gap-4 items-stretch">
          <div className="w-[3px] bg-[#00e0b3]" />
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#00e0b3] tracking-tight uppercase leading-tight font-mono">
              SYSTEM_REGISTRY //
              <br />
              EVENT_EVALUATION_RESULTS
            </h1>
            <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text">
              <span>EVENT: {event?.title?.toUpperCase() || "UNTITLED_EVENT"}</span>
            </div>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [ARCHIVE_REGISTRY_NODE]
        </div>
      </div>

      {/* Filters control block */}
      <FilterPanel
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        starRating={starRating}
        setStarRating={setStarRating}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* General Criteria Table */}
      <GeneralCriteriaTable
        filteredScores={generalTableScores}
        normalCriteria={normalCriteria}
        user={user}
        getUniqueGradersCount={getUniqueGradersCount}
        getProjectNamePlaceholder={getProjectNamePlaceholder}
      />

      {/* Specific Criteria Modules Grid */}
      {specificCriteria.length > 0 && (
        <SpecificCriteriaModules
          filteredScores={baseFilteredScores}
          specificCriteria={specificCriteria}
          user={user}
          sortOrder={sortOrder}
          filterMode={filterMode}
          getProjectNamePlaceholder={getProjectNamePlaceholder}
        />
      )}
    </div>
  )
}
