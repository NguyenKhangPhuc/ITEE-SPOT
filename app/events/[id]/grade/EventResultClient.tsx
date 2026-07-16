/**
 * PURPOSE:
 * Client Component for the Event Evaluation Results dashboard.
 * It provides advanced client-side filters (Search, All Results, Top 5, High Score, Multi-Graded, and Star Ratings),
 * maps project title placeholders, default sorts descending by final score, and allows toggling ascending/descending order.
 * Lời mời/Rating star filter uses the passed user.id to only include projects rated by this user.
 * Renders detailed General and Specific criteria results tables using the dark terminal design system.
 * Clicking a group name or project name navigates judges to the respective grading panel immediately.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/events/[id]/grade/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Single event record.
 * - eventCriteria (EventCriteriaInsert[], Required): Array of grading criteria.
 * - scores (SubmissionFinalScoresResponse, Required): Evaluated final scores database array.
 * - eventId (string, Required): Current event ID.
 * - user (User, Required): Current authenticated user object.
 */

'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { SubmissionFinalScoresResponse, SubmissionFinalScore } from "@/app/types/submission_final_score_view"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { CRITERIA_TYPE } from "@/app/types/enum"
import BackButton from "@/app/components/BackButton"
import { tw } from "@/app/constants/design-tokens"
import { EventInsert } from "@/app/types/event"

interface EventResultClientProps {
  event: EventInsert
  eventCriteria: Array<EventCriteriaInsert>
  scores: SubmissionFinalScoresResponse
  eventId: string
  user: User
}

type FilterMode = "all" | "top5" | "high" | "multi"

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

  // Filter and sort scores logic
  let filteredScores = [...scores]

  // Real-time Text Search
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase()
    filteredScores = filteredScores.filter(s =>
      s.group_name?.toLowerCase().includes(query)
    )
  }

  // Mode-based filtering
  if (filterMode === "top5") {
    // Sort descending, take top 5
    filteredScores = filteredScores
      .sort((a, b) => (b.final_avg_score || 0) - (a.final_avg_score || 0))
      .slice(0, 5)
  } else if (filterMode === "high") {
    filteredScores = filteredScores.filter(s => (s.final_avg_score || 0) >= 80)
  } else if (filterMode === "multi") {
    filteredScores = filteredScores.filter(s => getUniqueGradersCount(s) >= 3)
  }

  // Rating-based filtering: ONLY rating star given by the current user
  if (starRating !== "") {
    filteredScores = filteredScores.filter(s => {
      const userRating = s.raters?.find(r => r.user_id === user.id)
      return userRating && Math.round(userRating.rating) === Number(starRating)
    })
  }

  // Apply final sorting to general table rows (default descending, toggleable to ascending)
  filteredScores.sort((a, b) => {
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

      {/* Diversity Filter Panel */}
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

            <button
              onClick={() => {
                setFilterMode("high")
                setStarRating("")
              }}
              className={`px-4 py-2 font-mono text-[9px] font-bold tracking-wider uppercase rounded-sm border transition-all cursor-pointer ${
                filterMode === "high"
                  ? "bg-[#00e0b3] text-[#00382b] border-[#00e0b3]"
                  : "border-white/5 text-[#b9cbc2] hover:bg-white/5"
              }`}
            >
              HIGH EVALUATION
            </button>

            <button
              onClick={() => {
                setFilterMode("multi")
                setStarRating("")
              }}
              className={`px-4 py-2 font-mono text-[9px] font-bold tracking-wider uppercase rounded-sm border transition-all cursor-pointer ${
                filterMode === "multi"
                  ? "bg-[#00e0b3] text-[#00382b] border-[#00e0b3]"
                  : "border-white/5 text-[#b9cbc2] hover:bg-white/5"
              }`}
            >
              MULTI-GRADED
            </button>

            {/* Ascending / Descending Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
              className="px-4 py-2 font-mono text-[9px] font-bold tracking-wider uppercase rounded-sm border border-white/5 text-[#b9cbc2] hover:bg-white/5 flex items-center gap-1.5 cursor-pointer select-none"
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
                onChange={(e) => {
                  setStarRating(e.target.value !== "" ? Number(e.target.value) : "")
                  setFilterMode("all") // Reset Mode
                }}
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

      {/* 01_GENERAL_CRITERIA_REGISTRY Table Container */}
      <div className="flex flex-col gap-4">
        {/* Section Header */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider select-none">
          <div className="w-[3px] h-3 bg-[#00e0b3]" />
          <span>01_GENERAL_CRITERIA_REGISTRY</span>
        </div>

        {/* Scrollable Table */}
        <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-x-auto`}>
          <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider">
                <th className="p-4 font-bold">GROUP_NAME</th>
                <th className="p-4 font-bold">PROJECT_NAME</th>
                <th className="p-4 font-bold text-center">TOTAL_GRADERS</th>
                {normalCriteria.map(crit => (
                  <th key={crit.id} className="p-4 font-bold text-center min-w-[140px]">
                    {crit.criteria_name?.toUpperCase()}
                    <span className="block text-[6.5px] opacity-70">({crit.percentage}%)</span>
                  </th>
                ))}
                <th className="p-4 font-bold text-right text-[#00e0b3]">FINAL_EVALUATION</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredScores.length > 0 ? (
                  filteredScores.map((score, index) => {
                    const gradersCount = getUniqueGradersCount(score)
                    const projectName = getProjectNamePlaceholder(score.group_name)

                    return (
                      <motion.tr
                        key={score.submission_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                      >
                        <td className="p-4 font-bold text-[#e8e1df] max-w-[150px] truncate uppercase hover:text-[#00e0b3] transition-colors">
                          <Link href={`/submission/grading/${score.submission_id}`}>
                            {score.group_name || "UNNAMED_GROUP"}
                          </Link>
                        </td>
                        <td className="p-4 text-[#83958d] max-w-[180px] truncate hover:text-[#00e0b3] transition-colors">
                          <Link href={`/submission/grading/${score.submission_id}`}>
                            {projectName}
                          </Link>
                        </td>
                        <td className="p-4 text-center font-bold">
                          {String(gradersCount).padStart(3, '0')}
                        </td>
                        {normalCriteria.map(crit => {
                          const cell = score.normal_criteria?.find(c => c.criteria_id === crit.id)
                          const userGrade = cell?.graders?.find(g => g.user_id === user.id)?.grade
                          return (
                            <td key={crit.id} className="p-4 text-center min-w-[140px]">
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-bold text-[#e8e1df]">
                                  {cell?.avg_score !== null && cell?.avg_score !== undefined
                                    ? cell.avg_score.toFixed(1)
                                    : "0.0"}
                                </span>
                                <span className="text-[7.5px] font-mono tracking-wider uppercase">
                                  {userGrade !== undefined && userGrade !== null ? (
                                    <>
                                      YOURS: <span className="text-[#00e0b3] font-bold">{userGrade}</span>
                                    </>
                                  ) : (
                                    <span className="text-red-400/70 font-semibold text-[6.5px]">NOT_GRADED_YET</span>
                                  )}
                                </span>
                              </div>
                            </td>
                          )
                        })}
                        <td className="p-4 text-right font-bold text-[#00e0b3]">
                          {score.final_avg_score !== null && score.final_avg_score !== undefined
                            ? score.final_avg_score.toFixed(1)
                            : "0.0"}
                        </td>
                      </motion.tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4 + normalCriteria.length} className="p-12 text-center text-[#83958d] select-none">
                      NO PROJECT SCORE ENTRIES MATCHING ACTIVE FILTERS
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* 02_SPECIFIC_CRITERIA_MODULES Section */}
      {specificCriteria.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          {/* Section Header */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider select-none">
            <div className="w-[3px] h-3 bg-[#00e0b3]" />
            <span>02_SPECIFIC_CRITERIA_MODULES</span>
          </div>

          {/* Grid of Specific criteria sub-tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {specificCriteria.map((spec, index) => {
              const specName = spec.criteria_name || "SPECIFIC_MODULE"
              
              // Filter and Sort reactively by the specific module's avg_score based on sortOrder
              const projectsWithThisCriteria = filteredScores
                .filter(s => s.specific_criteria?.some(c => c.criteria_id === spec.id && c.avg_score !== null))
                .sort((a, b) => {
                  const cellA = a.specific_criteria.find(c => c.criteria_id === spec.id)
                  const cellB = b.specific_criteria.find(c => c.criteria_id === spec.id)
                  const scoreA = cellA?.avg_score || 0
                  const scoreB = cellB?.avg_score || 0
                  return sortOrder === "desc" ? scoreB - scoreA : scoreA - scoreB
                })

              return (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-5 flex flex-col gap-4`}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 select-none">
                    <span className="text-[9px] font-mono text-[#00e0b3] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">award_star</span>
                      MODULE: {specName.toUpperCase()}
                    </span>
                    <span className="text-[7px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
                      STATUS: MONITORING
                    </span>
                  </div>

                  {/* Sub table layout */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse font-mono text-[9px] text-[#b9cbc2] text-left">
                      <thead>
                        <tr className="border-b border-white/5 bg-[#151312]/40 text-[#83958d] select-none text-[8px] uppercase tracking-wider">
                          <th className="pb-2 pt-1 px-3">GROUP</th>
                          <th className="pb-2 pt-1 px-3">PROJECT</th>
                          <th className="pb-2 pt-1 px-3 text-center">GRADERS</th>
                          <th className="pb-2 pt-1 px-3 text-right text-[#00e0b3] min-w-[120px]">FINAL_AVG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectsWithThisCriteria.length > 0 ? (
                          projectsWithThisCriteria.map(score => {
                            const cell = score.specific_criteria.find(c => c.criteria_id === spec.id)
                            const critGradersCount = cell?.graders?.length || 0
                            const projectName = getProjectNamePlaceholder(score.group_name)

                            return (
                              <tr key={score.submission_id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                                <td className="py-2.5 px-3 font-bold text-[#e8e1df] truncate max-w-[100px] uppercase hover:text-[#00e0b3] transition-colors">
                                  <Link href={`/submission/grading/${score.submission_id}`}>
                                    {score.group_name || "UNNAMED"}
                                  </Link>
                                </td>
                                <td className="py-2.5 px-3 text-[#83958d] truncate max-w-[120px] hover:text-[#00e0b3] transition-colors">
                                  <Link href={`/submission/grading/${score.submission_id}`}>
                                    {projectName}
                                  </Link>
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold">
                                  {String(critGradersCount).padStart(2, '0')}
                                </td>
                                <td className="py-2.5 px-3 text-right min-w-[120px]">
                                  <div className="flex flex-col items-end gap-0.5">
                                    <span className="font-bold text-[#00e0b3]">
                                      {cell?.avg_score !== null && cell?.avg_score !== undefined
                                        ? cell.avg_score.toFixed(1)
                                        : "0.0"}
                                    </span>
                                    <span className="text-[7px] font-mono tracking-wider uppercase">
                                      {cell?.graders?.find(g => g.user_id === user.id)?.grade !== undefined &&
                                      cell?.graders?.find(g => g.user_id === user.id)?.grade !== null ? (
                                        <>
                                          YOURS: <span className="text-[#e8e1df] font-bold">{cell.graders.find(g => g.user_id === user.id)?.grade}</span>
                                        </>
                                      ) : (
                                        <span className="text-red-400/70 font-semibold text-[6px]">NOT_GRADED_YET</span>
                                      )}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-[#83958d] select-none">
                              NO EVALUATIONS REGISTRY ENTRIES RECORDED
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
