'use client'

import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import type { createSubmissionRating } from "@/app/actions/submission_ratings"
import type { updateSubmissionFeedback } from "@/app/actions/submission_feedback/put/updateSubmissionFeedback"
import { useNotification } from "@/app/context/NotificationContext"
import { useLoader } from "@/app/context/LoaderContext"
import { ProfileInsert } from "@/app/types/profile"
import { SubmissionRatingInsert } from "@/app/types/submission_rating"
import { SubmissionFeedback, SubmissionFeedbackInsert } from "@/app/types/submission_feedback"
import { PROFILE_ROLE } from "@/app/types/enum"
import { tw } from "@/app/constants/design-tokens"

interface PeerReviewFeedbackProps {
  submissionId: string
  user: ProfileInsert
  initialRating: SubmissionRatingInsert | null
  initialFeedback: SubmissionFeedback | null
  actions: {
    createSubmissionRating: typeof createSubmissionRating
    updateSubmissionFeedback: typeof updateSubmissionFeedback
  }
}

/**
 * PURPOSE:
 * Renders the interactive Peer Review Feedback card. It handles star rating clicks
 * (triggering createSubmissionRating) and feedback submissions (triggering updateSubmissionFeedback
 * on form submit). It models its dropdown/textarea layout after FeedbackSection.tsx
 * using the dark console terminal styling.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/submission/[groupId]/read-only/components/PeerReviewFeedback.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - submissionId (string, Required): Database ID of the selected challenge submission.
 * - user (ProfileInsert, Required): Profile of the logged-in user.
 * - initialRating (SubmissionRatingInsert | null, Required): Loaded rating for this user/submission.
 * - initialFeedback (SubmissionFeedback | null, Required): Loaded feedback for this user/submission.
 */
export default function PeerReviewFeedback({
  submissionId,
  user,
  initialRating,
  initialFeedback,
  actions,
}: PeerReviewFeedbackProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  // Local Star Rating States
  const [selectedRating, setSelectedRating] = useState<number | null>(initialRating?.rating ?? null)
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  // React Hook Form for Feedback Submission
  const {
    register: registerFeedback,
    handleSubmit: handleSubmitFeedback,
    formState: { errors },
    reset,
  } = useForm<SubmissionFeedbackInsert>({
    defaultValues: initialFeedback ?? {
      user_id: user.id,
      submission_id: submissionId,
      display_name: user?.full_name || user?.company_name || "",
      content: "",
    },
  })

  // Reset form default values when initialFeedback changes (e.g. when changing challenges)
  useEffect(() => {
    reset(initialFeedback ?? {
      user_id: user.id,
      submission_id: submissionId,
      display_name: user?.full_name || user?.company_name || "",
      content: "",
    })
    setSelectedRating(initialRating?.rating ?? null)
  }, [initialFeedback, initialRating, submissionId, user, reset])

  /**
   * BEHAVIORAL MECHANISM:
   * Maps a star rating (1 to 5) to its descriptive text label.
   *
   * PARAMETERS:
   * - rating (number): Rating value.
   *
   * RETURNS:
   * - string | null: Evaluative feedback description.
   */
  const getRatingDescriptor = (rating: number): string | null => {
    switch (rating) {
      case 1:
      case 2:
        return "I would rather not review this project because it is not my specialty area"
      case 3:
        return "I can review this project if needed"
      case 4:
        return "I can review this project"
      case 5:
        return "I definitely want to evaluate this project"
      default:
        return null
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Saves the rating immediately on star click via the createSubmissionRating server action.
   *
   * PARAMETERS:
   * - rating (number): The star rating chosen (1..5).
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleStarClick = async (rating: number) => {
    setIsOpenLoader(true)
    try {
      const upsertedRating: SubmissionRatingInsert = {
        submission_id: submissionId,
        user_id: user.id,
        rating,
      }

      const { error } = await actions.createSubmissionRating({ submissionRating: upsertedRating })
      if (error) throw new Error(error)

      setSelectedRating(rating)
      setIsOpenLoader(false)
      showNotification("Give a rating successfully")
    } catch (error) {
      setIsOpenLoader(false)
      if (error instanceof Error) showNotification(error.message)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Dispatches the feedback content to the updateSubmissionFeedback server action.
   *
   * PARAMETERS:
   * - feedback (SubmissionFeedbackInsert): Form data from react-hook-form.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleUpdateYourFeedback = async (feedback: SubmissionFeedbackInsert) => {
    setIsOpenLoader(true)
    try {
      // Ensure IDs are mapped correctly
      feedback.user_id = user.id
      feedback.submission_id = submissionId

      const { error } = await actions.updateSubmissionFeedback({ submissionFeedback: feedback })
      if (error) throw new Error(error)

      setIsOpenLoader(false)
      showNotification("Update the feedback successfully")
    } catch (error) {
      setIsOpenLoader(false)
      if (error instanceof Error) showNotification(error.message)
    }
  }

  const activeDisplayRating = hoveredStar ?? selectedRating
  const activeRatingText = activeDisplayRating ? getRatingDescriptor(activeDisplayRating) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden w-full`}
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sm text-[#00e0b3]">rate_review</span>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
            Peer_Review_Feedback
          </span>
        </div>

        {/* Rating Stars Selection */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
            Rating:
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = activeDisplayRating !== null && star <= activeDisplayRating
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="cursor-pointer text-base transition-transform hover:scale-110"
                >
                  <span
                    className={`material-symbols-outlined text-base ${
                      isFilled ? "text-[#00e0b3]" : "text-[#83958d]/30"
                    }`}
                    style={{ fontVariationSettings: isFilled ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400" }}
                  >
                    star
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmitFeedback(handleUpdateYourFeedback)} className="p-6 flex flex-col gap-5">
        {/* Rating description text indicator */}
        {activeRatingText && (
          <div className="border border-white/5 bg-[#151312]/30 px-4 py-2.5 rounded-sm">
            <p className="text-[10px] font-mono text-[#83958d] italic leading-normal">
              {activeRatingText}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Post As Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              Post_As
            </label>
            <select
              className="w-full bg-[#151312] border border-white/10 rounded-sm px-3 py-2 text-xs font-mono text-[#e8e1df] focus:outline-none focus:border-[#00e0b3]/50 cursor-pointer"
              {...registerFeedback("display_name", { required: "Display name is required" })}
            >
              {(user.role === PROFILE_ROLE.ADMIN || user.role === PROFILE_ROLE.JUDGES) && (
                <option value="Anonymous Company Representatives">Anonymous Company Representatives</option>
              )}
              {user?.full_name && (
                <option value={user.full_name}>{user.full_name}</option>
              )}
              {user?.company_name && (
                <option value={user.company_name}>{user.company_name}</option>
              )}
            </select>
            {errors.display_name && (
              <p className="text-red-400 text-[9px] font-mono">{errors.display_name.message}</p>
            )}
          </div>

          {/* Feedback Content Input (stretches to 2 cols on md+) */}
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              Add_Transmission
            </label>
            <textarea
              rows={3}
              placeholder="Enter feedback or technical inquiry..."
              className={`w-full bg-[#151312] border ${
                errors.content ? 'border-red-400/50' : 'border-white/10'
              } rounded-sm px-4 py-2 text-xs font-mono text-[#e8e1df] placeholder:text-[#83958d]/30 focus:outline-none focus:border-[#00e0b3]/50 transition-colors resize-none`}
              {...registerFeedback("content", { required: "Feedback description is required" })}
            />
            {errors.content && (
              <p className="text-red-400 text-[9px] font-mono">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2 border-t border-white/5">
          <button
            type="submit"
            className="border border-[#00e0b3]/40 bg-[#00e0b3]/10 hover:bg-[#00e0b3] hover:text-[#00382b] text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 transition-all duration-300 rounded-sm cursor-pointer"
          >
            Submit_Log
          </button>
        </div>
      </form>
    </motion.div>
  )
}
