/**
 * PURPOSE:
 * Renders the general evaluation criteria results table (01_GENERAL_CRITERIA_REGISTRY)
 * displaying project names, unique graders totals, average criteria score parameters,
 * and user's specific evaluations in a scrollable container.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of EventResultClient.tsx, located at 'app/events/[id]/grade/components/GeneralCriteriaTable.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - filteredScores (SubmissionFinalScore[], Required): Evaluated project scores matching active filters.
 * - normalCriteria (EventCriteriaInsert[], Required): Array of event criteria with NORMAL type.
 * - user (User, Required): Authenticated user session record.
 * - getUniqueGradersCount ((project: SubmissionFinalScore) => number, Required): Callback to compute unique evaluators.
 * - getProjectNamePlaceholder ((groupName: string | null) => string, Required): Callback to generate mock project name.
 */

'use client'

import { motion, AnimatePresence } from "framer-motion"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { SubmissionFinalScore } from "@/app/types/submission_final_score_view"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { tw } from "@/app/constants/design-tokens"

interface GeneralCriteriaTableProps {
  filteredScores: Array<SubmissionFinalScore>
  normalCriteria: Array<EventCriteriaInsert>
  user: User
  getUniqueGradersCount: (project: SubmissionFinalScore) => number
  getProjectNamePlaceholder: (groupName: string | null) => string
}

export default function GeneralCriteriaTable({
  filteredScores,
  normalCriteria,
  user,
  getUniqueGradersCount,
  getProjectNamePlaceholder,
}: GeneralCriteriaTableProps) {
  return (
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
  )
}
