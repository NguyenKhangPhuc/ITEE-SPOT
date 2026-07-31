/**
 * PURPOSE:
 * Client Component for the Submission Grading dashboard.
 * It manages grading inputs via react-hook-form, watches values for dynamic score computation,
 * and renders a terminal-themed split dashboard for evaluating general and specific criteria.
 * Feedback section has been completely removed.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/submission/grading/[submissionId]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - eventCriteria (EventCriteriaInsert[], Required): Array of event criteria.
 * - submission (SubmissionWithEventId, Required): The target submission record.
 * - user (Profile, Required): The profile of the evaluator.
 * - userGrading (UserSubmissionGradeWithPercentage[], Required): Pre-existing grading entries.
 */

'use client'

import { useForm, useWatch } from "react-hook-form"
import { motion } from "framer-motion"
import { updateUserGrading } from "@/app/actions/user_grading/put/updateUserGrading"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { CRITERIA_TYPE } from "@/app/types/enum"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { Profile } from "@/app/types/profile"
import { SubmissionWithEventId } from "@/app/types/submission"
import { UserSubmissionGradeInsert, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade"
import BackButton from "@/app/components/BackButton"
import GeneralCriteriaSection from "./components/GeneralCriteriaSection"
import SpecificCriteriaSection from "./components/SpecificCriteriaSection"
import { tw } from "@/app/constants/design-tokens"

interface GradeValue {
  normalGrades: Array<UserSubmissionGradeWithPercentage>
  specificGrades: Array<UserSubmissionGradeWithPercentage>
}

export default function SubmissionGradingClient({
  eventCriteria,
  submission,
  user,
  userGrading,
}: {
  eventCriteria: Array<EventCriteriaInsert>
  submission: SubmissionWithEventId
  user: Profile
  userGrading: Array<UserSubmissionGradeWithPercentage>
}) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const normalCriteria = eventCriteria.filter(ele => ele.type === CRITERIA_TYPE.NORMAL)
  const specificCriteria = eventCriteria.filter(ele => ele.type === CRITERIA_TYPE.SPECIFIC)

  // Initialize react-hook-form with pre-existing grades or default values of 50
  const { register, control, handleSubmit } = useForm<GradeValue>({
    defaultValues: {
      normalGrades: userGrading.length !== 0
        ? userGrading.filter(ele => ele.event_grading_criteria?.type === CRITERIA_TYPE.NORMAL)
        : normalCriteria.map(ele => ({
            event_criteria_id: ele.id,
            user_id: user.id,
            submission_id: submission?.id,
            grade: 50,
            event_grading_criteria: {
              percentage: ele.percentage,
              type: ele.type
            }
          })),
      specificGrades: userGrading.length !== 0
        ? userGrading.filter(ele => ele.event_grading_criteria?.type === CRITERIA_TYPE.SPECIFIC)
        : specificCriteria.map(ele => ({
            event_criteria_id: ele.id,
            user_id: user.id,
            submission_id: submission?.id,
            grade: 50,
            event_grading_criteria: {
              percentage: ele.percentage,
              type: ele.type
            }
          })),
    },
  })

  // Watch grades values to update overall score telemetry reactively
  const gradesValue = useWatch({
    name: 'normalGrades',
    control: control
  })
  
  const specificGrades = useWatch({
    name: 'specificGrades',
    control: control
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Computes the weighted average sum of normal criteria grades.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - string | number: The formatted score.
   */
  const handleCalculateFinalPoints = (): string | 0 => {
    if (!gradesValue || gradesValue.length === 0) return 0
    const sumOfGrades = gradesValue.reduce((acc, cur) => {
      if (cur.event_grading_criteria?.type === CRITERIA_TYPE.NORMAL) {
        const val = Number(cur.grade) || 0
        const percentage = cur.event_grading_criteria?.percentage || 0
        return acc + (val * percentage) / 100
      }
      return acc
    }, 0)

    return sumOfGrades.toFixed(2)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Submits grades to the database, mapping and stripping internal percentage keys.
   *
   * PARAMETERS:
   * - data (GradeValue): Form submit values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleGiveGrade = async (data: GradeValue): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const combinedGrade = [...data.normalGrades, ...data.specificGrades]
      const removedPercentageGrades: Array<UserSubmissionGradeInsert> = combinedGrade.map(ele => ({
        event_criteria_id: ele.event_criteria_id,
        user_id: ele.user_id,
        submission_id: ele.submission_id,
        grade: ele.grade,
      }))
      
      const { error } = await updateUserGrading({
        grades: removedPercentageGrades,
        submissionId: submission?.id ?? ""
      })
      
      if (error) {
        throw new Error(error)
      }
      showNotification("Give grade successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Back navigation button */}
      <BackButton />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-4">
        <div className="flex gap-4 items-stretch">
          {/* Vertical accent bar */}
          <div className="w-[3px] bg-[#00e0b3]" />
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#00e0b3] tracking-tight uppercase leading-tight font-mono">
              SYSTEM_REGISTRY //
              <br />
              SUBMISSION_GRADING
            </h1>
            <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1 select-text">
              <span>SUBMISSION: {submission?.title?.toUpperCase() || "UNTITLED_SUBMISSION"}</span>
              <span>|</span>
              <span>EVALUATOR: {user?.full_name?.toUpperCase() || "UNMAPPED_NODE"}</span>
            </div>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [GRADING_SESSION_ACTIVE]
        </div>
      </div>

      {/* Main Grid Forms */}
      <form onSubmit={handleSubmit(handleGiveGrade)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-text">
        {/* Left Column: Criteria Evaluation Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GeneralCriteriaSection
            register={register}
            normalCriteria={normalCriteria}
            handleCalculateFinalPoints={handleCalculateFinalPoints}
            gradesValue={gradesValue}
          />

          <SpecificCriteriaSection
            register={register}
            specificCriteria={specificCriteria}
            specificGrades={specificGrades}
          />
        </div>

        {/* Right Column: Dynamic summary score telemetry */}
        <div className="lg:col-span-4 flex flex-col gap-6 select-none">
          <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5 relative overflow-hidden`}>
            {/* Top accent border line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00e0b3]" />

            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              GRADING_TELEMETRY
            </span>

            {/* General Criteria Breakdown */}
            <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
                01_GENERAL_CRITERIA_BREAKDOWN
              </span>
              
              <div className="flex flex-col gap-2">
                {normalCriteria.map((crit, idx) => {
                  const grade = gradesValue?.[idx]?.grade ?? 50
                  const percentage = crit.percentage || 0
                  const contribution = (grade * percentage) / 100

                  return (
                    <div key={crit.id} className="flex justify-between items-center text-[10px] font-mono text-[#b9cbc2]">
                      <span className="truncate max-w-[55%] uppercase tracking-wide text-[#83958d]">
                        {crit.criteria_name}
                      </span>
                      <span className="shrink-0 text-right select-text font-bold">
                        {grade} &times; {percentage}% = <span className="text-[#00e0b3]">{contribution.toFixed(2)}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Score telemetric read-out */}
            <div className="flex flex-col items-center justify-center py-6 bg-[#151312] border border-white/5 rounded-sm select-text mt-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(0,224,179,0.015)_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
              
              <motion.span 
                key={handleCalculateFinalPoints().toString()}
                initial={{ scale: 0.95, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-mono font-bold text-[#00e0b3] z-10"
              >
                {handleCalculateFinalPoints()}
              </motion.span>
              <span className="text-[8.5px] font-mono text-[#83958d] uppercase tracking-widest mt-1 select-none z-10">
                OVERALL_GRADE / 100
              </span>
            </div>

            {/* Specific Criteria Breakdown */}
            {specificCriteria.length > 0 && (
              <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4 mt-2">
                <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
                  02_SPECIFIC_CRITERIA_BREAKDOWN
                </span>
                
                <div className="flex flex-col gap-2">
                  {specificCriteria.map((crit, idx) => {
                    const grade = specificGrades?.[idx]?.grade ?? 50
                    const percentage = crit.percentage || 0
                    const contribution = (grade * percentage) / 100

                    return (
                      <div key={crit.id} className="flex justify-between items-center text-[9px] font-mono text-[#b9cbc2]">
                        <span className="truncate max-w-[60%] uppercase tracking-wide text-[#83958d]">
                          {crit.criteria_name}
                        </span>
                        <span className="shrink-0 text-right select-text font-bold">
                          {grade} &times; {percentage}% = <span className="text-[#00e0b3]">{contribution.toFixed(2)}</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <p className="text-[10px] font-mono text-[#b9cbc2] leading-relaxed mt-2 border-t border-white/5 pt-4">
              Verify all grading criteria sliders are properly mapped. Submitting points syncs grades immediately to the system database.
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-[#00e0b3] text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer text-center select-none"
            >
              SUBMIT_POINTS
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}