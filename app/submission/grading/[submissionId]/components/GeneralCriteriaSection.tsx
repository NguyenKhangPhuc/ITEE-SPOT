/**
 * PURPOSE:
 * Renders the General Criteria grading list (01_GENERAL_CRITERIA) with range sliders
 * and dynamic grade badge counters.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of SubmissionGradingClient.tsx, located at 'app/submission/grading/[submissionId]/components/GeneralCriteriaSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - normalCriteria (EventCriteriaInsert[], Required): Array of event criteria with NORMAL type.
 * - register (UseFormRegister<GradeValue>, Required): react-hook-form register callback.
 * - gradesValue (UserSubmissionGradeWithPercentage[], Required): Watch array of normal criteria grades.
 * - handleCalculateFinalPoints (() => string | 0, Required): Callback to compute overall average.
 */

'use client'

import { UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { GradeValue, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade"
import { tw } from "@/app/constants/design-tokens"

interface GeneralCriteriaSectionProps {
  normalCriteria: Array<EventCriteriaInsert>
  register: UseFormRegister<GradeValue>
  gradesValue: UserSubmissionGradeWithPercentage[]
  handleCalculateFinalPoints: () => string | 0
}

export default function GeneralCriteriaSection({
  normalCriteria,
  register,
  gradesValue,
  handleCalculateFinalPoints,
}: GeneralCriteriaSectionProps) {
  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-6 relative overflow-hidden select-none`}>
      
      {/* Section Header with badge */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm text-[#00e0b3]">star</span>
          <span>01_GENERAL_CRITERIA</span>
        </div>
        <span className="px-2 py-0.5 border border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3] rounded-sm font-mono text-[7px] font-bold uppercase tracking-widest">
          NORMAL WEIGHT
        </span>
      </div>

      {/* Criteria Cards Stack */}
      <div className="flex flex-col gap-5">
        {normalCriteria.map((field, index) => {
          const currentVal = gradesValue?.[index]?.grade ?? 50

          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col gap-3 pb-5 border-b border-white/5 last:border-0 last:pb-0 select-text"
            >
              {/* Criteria Title Row */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
                    {field.criteria_name || "UNNAMED_CRITERIA"}
                  </h3>
                  <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest">
                    TYPE: {field.type}
                  </span>
                </div>
                <span className="px-2 py-0.5 border border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3] rounded-sm font-mono text-[8px] font-bold uppercase tracking-widest shrink-0">
                  {field.percentage}% WEIGHT
                </span>
              </div>

              {/* Description */}
              <p className="text-[10px] font-mono text-[#b9cbc2] leading-relaxed">
                {field.criteria_description || "No criteria description mapped."}
              </p>

              {/* Technical Range Slider */}
              <div className="flex items-center gap-4 w-full bg-[#151312] border border-white/5 p-3 rounded-sm mt-1 select-none">
                <input
                  type="range"
                  min="1"
                  max="100"
                  className="flex-1 accent-[#00e0b3] bg-white/5 h-1 rounded-lg appearance-none cursor-pointer"
                  {...register(`normalGrades.${index}.grade`, { valueAsNumber: true })}
                />
                <motion.span
                  key={currentVal}
                  initial={{ scale: 0.92, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-mono text-xs text-[#00e0b3] font-bold w-14 text-right shrink-0 select-text"
                >
                  {currentVal} / 100
                </motion.span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
