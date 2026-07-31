'use client'

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { GroupSubmissions } from "@/app/types/submission"
import { ProfileInsert } from "@/app/types/profile"
import { SubmissionRatingInsert } from "@/app/types/submission_rating"
import { SubmissionFeedback } from "@/app/types/submission_feedback"
import { PROFILE_ROLE } from "@/app/types/enum"
import { GroupInfo } from "@/app/types/group"
import { getSubmissionRatingById } from "@/app/actions/submission_ratings"
import { runSubmissionFeedbackAction } from "@/app/actions/submission_feedback/actions.gateway"
import { getPublicFileURL } from "@/app/actions/file_url"
import { useNotification } from "@/app/context/NotificationContext"
import { useLoader } from "@/app/context/LoaderContext"
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor"
import BackButton from "@/app/components/BackButton"
import ReadOnlySubmissionHeader from "./components/ReadOnlySubmissionHeader"
import ReadOnlyYoutubeVideo from "./components/ReadOnlyYoutubeVideo"
import PeerReviewFeedback from "./components/PeerReviewFeedback"
import { tw } from "@/app/constants/design-tokens"

interface ReadOnlySubmissionClientProps {
  groupSubmissions: GroupSubmissions
  user: ProfileInsert
  groupInfo: GroupInfo | null
}

/**
 * PURPOSE:
 * Orchestrates the read-only submission details viewer. It renders a list of challenge selector
 * cards at the top. Selecting a challenge fetches the corresponding peer rating and feedback logs
 * server-side, then displays the project description via ReadOnlyEditor, and shows active
 * challenges, files, and links in a dark console sidebar.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/submission/[groupId]/read-only/page.tsx'. Sub-components reside in
 * 'app/submission/[groupId]/read-only/components/'.
 *
 * INPUTS / PARAMETERS:
 * - groupSubmissions (GroupSubmissions, Required): Array of submissions made by the group.
 * - user (ProfileInsert, Required): Profile of the logged-in user.
 */
export default function ReadOnlySubmissionClient({
  groupSubmissions,
  user,
  groupInfo,
}: ReadOnlySubmissionClientProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  // Orchestrator States
  const [chosenIndex, setChosenIndex] = useState<number | null>(null)
  const [userRating, setUserRating] = useState<SubmissionRatingInsert | null>(null)
  const [userFeedback, setUserFeedback] = useState<SubmissionFeedback | null>(null)

  /**
   * BEHAVIORAL MECHANISM:
   * Handles user selection of a challenge tab. It fetches the existing rating and feedback
   * record for the selected submission, sets loading animations during the query, and loads
   * the details into local states.
   *
   * PARAMETERS:
   * - index (number): Array index of the chosen submission.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleChooseChallengeSubmission = async (index: number) => {
    if (!groupSubmissions || !groupSubmissions[index]) return
    setIsOpenLoader(true)
    const submissionId = groupSubmissions[index].id!

    try {
      // 1. Fetch user rating
      const { data: ratingData, error: ratingError } = await getSubmissionRatingById({
        submissionId,
        userId: user.id,
      })
      if (ratingError) throw new Error(ratingError)

      // 2. Fetch user feedback log
      const { data: feedbackData, error: feedbackError } = await runSubmissionFeedbackAction({
        type: 'getSubmissionFeedBackByUserIdAndSubmissionId',
        payload: {
          userId: user.id,
          submissionId,
        }
      })
      if (feedbackError) throw new Error(feedbackError)

      setUserRating(ratingData ?? null)
      setUserFeedback(feedbackData ?? null)
      setChosenIndex(index)
      setIsOpenLoader(false)
    } catch (error) {
      setIsOpenLoader(false)
      if (error instanceof Error) showNotification(error.message)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Extracts the YouTube video ID and returns a clean embed URL.
   * Supports standard watch links, shortened, embed formats, and shorts.
   *
   * PARAMETERS:
   * - url (string | null | undefined): Raw link from form input.
   *
   * RETURNS:
   * - string | null: Embed URL or null if invalid.
   */
  const handleGetEmbeddedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    try {
      // Handles cases where the URL is already an embed URL or other YouTube formats
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/
      const match = url.match(regExp)
      
      const videoId = (match && match[2].length === 11) ? match[2] : null
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
      
      // Fallback: Check if it's already an 11-char ID
      if (url.trim().length === 11) {
        return `https://www.youtube.com/embed/${url.trim()}`
      }

      return null
    } catch (e) {
      return null
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers download of submission file attachments.
   *
   * PARAMETERS:
   * - storagePath (string | null): The storage bucket path.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleDownloadFile = async (storagePath: string | null) => {
    if (!storagePath) return
    try {
      const { data, error } = await getPublicFileURL(storagePath)
      if (error) throw new Error(error)
      if (data?.publicUrl) window.open(data.publicUrl, "_blank")
    } catch (error) {
      if (error instanceof Error) showNotification(error.message)
    }
  }

  const activeSubmission = chosenIndex !== null ? groupSubmissions?.[chosenIndex] : null
  const hasSubmissions = groupSubmissions && groupSubmissions.length > 0

  return (
    <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-montserrat`}>
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        {/* Back Navigation */}
        <BackButton />

        {/* Challenge Selection Row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-widest block mb-3">
            Select_Challenge_Submission
          </span>

          {!hasSubmissions ? (
            <div className="text-sm font-mono text-[#83958d] italic">
              No submissions registered yet for this group cluster.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groupSubmissions.map((sub, idx) => {
                const isSelected = chosenIndex === idx
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleChooseChallengeSubmission(idx)}
                    className={`text-left p-5 border rounded-sm transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "border-[#00e0b3] bg-[#00e0b3]/5"
                        : "border-white/5 bg-[#151312]/40 hover:border-white/10"
                    }`}
                  >
                    <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider block">
                      {sub.group_challenge?.event_challenges?.company_name ?? "Challenge Corp"}
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest block mt-1 ${
                      isSelected ? "text-[#00e0b3]" : "text-[#e8e1df]"
                    }`}>
                      {sub.group_challenge?.event_challenges?.title ?? "Untitled Challenge"}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Selected Submission Layout */}
        <AnimatePresence mode="wait">
          {activeSubmission && (
            <motion.div
              key={activeSubmission.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-8"
            >
              {/* Header Title & Status */}
              <ReadOnlySubmissionHeader
                breadcrumbs={[
                  groupInfo?.events?.title ?? "Event",
                  groupInfo?.group_name ?? "Group",
                  "Submissions",
                  activeSubmission.title ?? "Project",
                ]}
                title={activeSubmission.title ?? "Node_Untitled"}
                tagline={activeSubmission.short_description ?? "No synopsis parameters mapped."}
                groupName={groupInfo?.group_name  ?? "Cluster Node"}
                createdAt={activeSubmission.created_at}
              />

              {/* Two-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Description content */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 md:p-8`}>
                    <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#00e0b3] border-b border-white/5 pb-4 mb-6">
                      Project_Context: Rich_Description
                    </h2>
                    <div className="event-detail-editor">
                      <ReadOnlyEditor content={activeSubmission.description ?? ""} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Project Resources */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}>
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#e8e1df]">
                        Project_Resources
                      </span>
                      <span className="material-symbols-outlined text-xs text-[#00e0b3]">folder_open</span>
                    </div>

                    <div className="p-6 flex flex-col gap-6">
                      {/* GitHub Link */}
                      {activeSubmission.github_link && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
                            Source_Repository
                          </span>
                          <a
                            href={activeSubmission.github_link}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-between border border-white/10 hover:border-[#00e0b3]/30 bg-[#151312]/40 px-4 py-3 rounded-sm text-xs font-mono text-[#e8e1df] hover:text-[#00e0b3] transition-colors cursor-pointer group"
                          >
                            <span className="truncate">{activeSubmission.github_link.replace("https://", "")}</span>
                            <span className="material-symbols-outlined text-xs shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                              open_in_new
                            </span>
                          </a>
                        </div>
                      )}

                      {/* YouTube Video Preview */}
                      {activeSubmission.youtube_link && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
                            Visual_Showcase_Preview
                          </span>
                          <ReadOnlyYoutubeVideo
                            embeddedUrl={handleGetEmbeddedUrl(activeSubmission.youtube_link)}
                          />
                        </div>
                      )}

                      {/* Payload Attachments */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
                          Node_Payload_Assets
                        </span>
                        {activeSubmission.submission_files && activeSubmission.submission_files.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {activeSubmission.submission_files.map((file) => (
                              <button
                                key={file.id}
                                type="button"
                                onClick={() => handleDownloadFile(file.storage_path)}
                                className="w-full flex items-center justify-between border border-white/5 bg-[#151312]/40 px-4 py-3 rounded-sm hover:border-[#00e0b3]/20 transition-colors text-left cursor-pointer group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="material-symbols-outlined text-sm text-[#83958d] group-hover:text-[#00e0b3] transition-colors shrink-0">
                                    insert_drive_file
                                  </span>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-mono text-[#e8e1df] truncate">
                                      {file.original_file_name}
                                    </span>
                                    {file.size && (
                                      <span className="text-[8px] font-mono text-[#83958d] uppercase mt-0.5">
                                        {(file.size / (1024 * 1024)).toFixed(1)}_MB
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="material-symbols-outlined text-xs text-[#83958d] group-hover:text-[#00e0b3] transition-colors shrink-0 ml-2">
                                  download
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[9px] font-mono text-[#83958d] italic">
                            No assets uploaded for this payload.
                          </span>
                        )}
                      </div>

                      {/* Active Challenge Tags & Student Feedback Link */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                        <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
                          Active_Challenges
                        </span>
                        {activeSubmission.group_challenge?.event_challenges && (
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-[8px] font-mono font-bold border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm select-none">
                              {activeSubmission.group_challenge.event_challenges.title?.toUpperCase().replace(" ", "_")}
                            </span>
                          </div>
                        )}

                        {/* See Submission Feedback Button (STUDENT role only) */}
                        {user.role === PROFILE_ROLE.STUDENT && activeSubmission.id && (
                          <Link
                            href={`/submission/feedback/${activeSubmission.id}`}
                            className="w-full mt-2 flex items-center justify-center gap-2 border border-[#00e0b3] bg-[#00e0b3]/10 hover:bg-[#00e0b3] hover:text-[#00382b] text-[#00e0b3] font-mono text-xs uppercase font-bold tracking-widest py-2.5 px-4 transition-all duration-300 rounded-sm cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">forum</span>
                            <span>See your submission feedback</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Access Grading Protocol Button (ADMIN or JUDGES role only) */}
                  {(user.role === PROFILE_ROLE.ADMIN || user.role === PROFILE_ROLE.JUDGES) && (
                    <Link
                      href={`/submission/grading/${activeSubmission.id}`}
                      className="w-full flex items-center justify-center gap-3 border border-[#00e0b3] bg-transparent hover:bg-[#00e0b3]/5 text-[#00e0b3] font-mono text-xs uppercase font-bold tracking-widest py-3.5 transition-all duration-300 rounded-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">gavel</span>
                      <span>Access Grading Protocol</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Peer Review Feedback & Rating Panel */}
              <PeerReviewFeedback
                key={activeSubmission.id}
                submissionId={activeSubmission.id!}
                user={user}
                initialRating={userRating}
                initialFeedback={userFeedback}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
