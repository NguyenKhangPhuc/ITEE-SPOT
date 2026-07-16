/**
 * PURPOSE:
 * Renders the specific evaluation criteria modules grid (02_SPECIFIC_CRITERIA_MODULES)
 * containing sub-tables displaying group, project name placeholders, graders totals,
 * final average points, and judge's specific evaluations in a 2-column layout.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of EventResultClient.tsx, located at 'app/events/[id]/grade/components/SpecificCriteriaModules.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - filteredScores (SubmissionFinalScore[], Required): Evaluated project scores matching active filters.
 * - specificCriteria (EventCriteriaInsert[], Required): Array of event criteria with SPECIFIC type.
 * - user (User, Required): Authenticated user session record.
 * - sortOrder ("desc" | "asc", Required): Toggle sorting order direction.
 * - getProjectNamePlaceholder ((groupName: string | null) => string, Required): Callback to generate mock project name.
 */

'use client'

import { motion } from "framer-motion"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { SubmissionFinalScore } from "@/app/types/submission_final_score_view"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { tw } from "@/app/constants/design-tokens"

interface SpecificCriteriaModulesProps {
  filteredScores: Array<SubmissionFinalScore>
  specificCriteria: Array<EventCriteriaInsert>
  user: User
  sortOrder: "desc" | "asc"
  filterMode: string
  getProjectNamePlaceholder: (groupName: string | null) => string
}

export default function SpecificCriteriaModules({
  filteredScores,
  specificCriteria,
  user,
  sortOrder,
  filterMode,
  getProjectNamePlaceholder,
}: SpecificCriteriaModulesProps) {
  return (
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
          
          // 1. Filter only projects that have grading records for this specific criteria
          let projectsWithThisCriteria = filteredScores.filter(s =>
            s.specific_criteria?.some(c => c.criteria_id === spec.id && c.avg_score !== null)
          )

          // 2. If TOP 5 HIGHEST is selected, sort by specific avg_score descending and slice 5
          if (filterMode === "top5") {
            projectsWithThisCriteria = projectsWithThisCriteria
              .sort((a, b) => {
                const cellA = a.specific_criteria.find(c => c.criteria_id === spec.id)
                const cellB = b.specific_criteria.find(c => c.criteria_id === spec.id)
                const scoreA = cellA?.avg_score || 0
                const scoreB = cellB?.avg_score || 0
                return scoreB - scoreA
              })
              .slice(0, 5)
          }
          

          // 3. Apply final sortOrder sorting reactively
          projectsWithThisCriteria.sort((a, b) => {
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
  )
}
