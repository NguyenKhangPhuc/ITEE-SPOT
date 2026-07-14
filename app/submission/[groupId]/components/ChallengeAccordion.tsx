'use client'

// Trigger rebuild to update constants
import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Editor } from "@tiptap/core"
import { EventChallenge } from "@/app/types/event_challenges"
import { GroupChallengeRelation } from "@/app/types/group_challenge"
import { SubmissionInsert } from "@/app/types/submission"
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { getGoupChallengeSubmission, saveGroupChallengeSubmission } from "@/app/actions/submissions"
import { getPublicFileURL } from "@/app/actions/file_url"
import { useNotification } from "@/app/context/NotificationContext"
import { useLoader } from "@/app/context/LoaderContext"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor"
import {
  MAX_TOTAL_SIZE,
  STUDENT_SUBMISSION_DESCRIPTION,
  EXAMPLE_PROJECT_SUMMANRY,
} from "@/app/constants"
import SubmissionFormFields from "./SubmissionFormFields"
import SubmissionPreview from "./SubmissionPreview"
import { tw } from "@/app/constants/design-tokens"
import SubmissionFileSection from "./SubmissionFileSection"

interface ChallengeAccordionProps {
  challenge: EventChallenge
  groupId: string
  groupChallengeRelation: GroupChallengeRelation | null
  isOpen: boolean
  onToggle: () => void
}

/**
 * PURPOSE:
 * Renders a single challenge item inside a vertical accordion list. If the group has
 * registered for this challenge (active), clicking the header expands a Framer Motion
 * dropdown containing the full multi-part submission form (text fields, TipTap editor,
 * preview block, file uploader, and save/see links). If not registered, the card is
 * rendered in a locked/disabled state.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/submission/[groupId]/SubmissionClient.tsx' and placed in
 * 'app/submission/[groupId]/components/ChallengeAccordion.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - challenge (EventChallenge, Required): The challenge database record.
 * - groupId (string, Required): The current group's ID.
 * - groupChallengeRelation (GroupChallengeRelation | null, Required): Group challenge mapping,
 *   used to check if this challenge is active or locked for this group.
 * - isOpen (boolean, Required): Controls whether this accordion's body is expanded.
 * - onToggle (() => void, Required): Callback to expand/collapse this accordion item.
 */
export default function ChallengeAccordion({
  challenge,
  groupId,
  groupChallengeRelation,
  isOpen,
  onToggle,
}: ChallengeAccordionProps) {
  const isLocked = !groupChallengeRelation
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  // Form States (isolated per challenge accordion)
  const [initialEditorContent, setInitialEditorContent] = useState<string | null>(null)
  const [editorValue, setEditorValue] = useState<Editor | null>(null)
  const [submittedFiles, setSubmittedFiles] = useState<Array<SubmissionFileExtended>>([])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },

  } = useForm<SubmissionInsert>()

  /**
   * BEHAVIORAL MECHANISM:
   * Dynamically resolves a suitable Material Symbols icon depending on the challenge title.
   *
   * PARAMETERS:
   * - title (string | null): The challenge title.
   *
   * RETURNS:
   * - string: The resolved icon key.
   */
  const getChallengeIcon = (title: string | null): string => {
    if (!title) return "task"
    const lower = title.toLowerCase()
    if (lower.includes("ai") || lower.includes("intelligence")) return "psychology"
    if (lower.includes("app") || lower.includes("development")) return "terminal"
    if (lower.includes("infrastructure") || lower.includes("network")) return "settings"
    return "hub"
  }

  // Fetch submission data when this accordion expands
  useEffect(() => {
    if (isOpen && !isLocked && groupChallengeRelation) {
      const fetchSubmission = async () => {
        try {
          const { data, error } = await getGoupChallengeSubmission({
            groupChallengeId: groupChallengeRelation.id,
            groupId,
          })
          if (error) throw new Error(error)

          if (data) {
            reset(data)
            setInitialEditorContent(data.description)
            setSubmittedFiles(data.submission_files ?? [])
          } else {
            reset({
              id: undefined,
              github_link: "",
              youtube_link: "",
              short_description: "",
              group_challenge_id: undefined,
              group_id: undefined,
              created_at: undefined,
            })
            setInitialEditorContent(null)
            setSubmittedFiles([])
          }
        } catch (error) {
          if (error instanceof Error) showNotification(error.message)
        }
      }
      fetchSubmission()
    }
  }, [isOpen, isLocked, groupChallengeRelation, groupId, reset, showNotification])

  /**
   * BEHAVIORAL MECHANISM:
   * Validates and catches files added by the user, checking total size constraints.
   *
   * PARAMETERS:
   * - file (File): The file object captured.
   *
   * RETURNS:
   * - void
   */
  const handleCatchFiles = (file: File) => {
    const currentFilesSize = submittedFiles.reduce((acc, f) => acc + (f.size ?? 0), 0)
    if (currentFilesSize + file.size > MAX_TOTAL_SIZE) {
      showNotification("File upload limit exceeded (5MB max)")
    } else {
      const newFile: SubmissionFileExtended = {
        original_file_name: file.name,
        size: file.size,
        mime_type: file.type,
        file,
      }
      setSubmittedFiles((prev) => [...prev, newFile])
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Removes a file from the uploaded files list by index.
   *
   * PARAMETERS:
   * - fileIndex (number): Array index of the file to remove.
   *
   * RETURNS:
   * - void
   */
  const handleDeleteFiles = (fileIndex: number) => {
    setSubmittedFiles((prev) => prev.filter((_, idx) => idx !== fileIndex))
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves a storage path or opens a local blob URL in a new window for file downloads.
   *
   * PARAMETERS:
   * - file (SubmissionFileExtended): The file object.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleDownloadFile = async (file: SubmissionFileExtended) => {
    if (file.storage_path) {
      try {
        const { data, error } = await getPublicFileURL(file.storage_path)
        if (error) throw new Error(error)
        if (data?.publicUrl) window.open(data.publicUrl, "_blank")
      } catch (error) {
        if (error instanceof Error) showNotification(error.message)
      }
    } else if (file.file) {
      const localUrl = URL.createObjectURL(file.file)
      window.open(localUrl, "_blank")
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers the saveGroupChallengeSubmission server action to commit the form payload
   * along with rich-text content, submitted files, and fun facts.
   *
   * PARAMETERS:
   * - data (SubmissionInsert): Form fields payload.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSaveSubmission = async (data: SubmissionInsert) => {
    if (isLocked || !groupChallengeRelation) return
    setIsOpenLoader(true)

    try {
      data.group_id = groupId
      data.group_challenge_id = groupChallengeRelation.id
      data.description = editorValue?.getHTML() ?? ""

      if (!data.group_id || !data.group_challenge_id) {
        throw new Error("Unable to save: group parameters missing")
      }

      const { error } = await saveGroupChallengeSubmission({
        submission: data,
        submittedFiles,
        funfacts: [], // Fun facts kept as empty array per user requirements
      })

      if (error) throw new Error(error)
      setIsOpenLoader(false)
      showNotification("Save submission successfully")
    } catch (error) {
      if (error instanceof Error) showNotification(error.message)
      setIsOpenLoader(false)
    }
  }

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden mb-4`}>
      {/* Accordion Header */}
      <button
        type="button"
        disabled={isLocked}
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-6 py-4 transition-colors font-mono select-none ${isLocked
            ? "bg-[#151312]/20 opacity-50 cursor-not-allowed"
            : "hover:bg-[#1d1b1a]/50 cursor-pointer"
          }`}
      >
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined text-sm ${isLocked ? 'text-[#83958d]' : 'text-[#00e0b3]'}`}>
            {getChallengeIcon(challenge.title)}
          </span>
          <span className={`text-xs font-bold uppercase tracking-widest ${isLocked ? 'text-[#83958d]' : 'text-[#e8e1df]'}`}>
            {challenge.title ?? "Unnamed Challenge"}
          </span>
        </div>

        {isLocked ? (
          <div className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border border-white/10 bg-white/5 text-[#83958d] rounded-sm">
            LOCKED
          </div>
        ) : (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="material-symbols-outlined text-sm text-[#83958d]"
          >
            expand_more
          </motion.span>
        )}
      </button>

      {/* Accordion Body */}
      <AnimatePresence initial={false}>
        {isOpen && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5"
          >
            <form onSubmit={handleSubmit(handleSaveSubmission)} className="p-6 flex flex-col gap-6">
              {/* Form Input Grid */}
              <SubmissionFormFields register={register} errors={errors} control={control} />

              {/* dashed Dropzone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
                  Node_Payload: File_Uploader
                </label>
                <div className="relative w-full h-32 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center hover:border-[#00e0b3]/30 transition-colors group">
                  <div className="text-center flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <span className="material-symbols-outlined text-xl text-[#83958d] group-hover:text-[#00e0b3] transition-colors">
                      cloud_upload
                    </span>
                    <p className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider">
                      Drag & Drop project archive or{" "}
                      <span className="text-[#00e0b3] font-semibold underline decoration-dotted">
                        browse filesystem
                      </span>
                    </p>
                    <p className="text-[8px] font-mono text-[#83958d]/50 uppercase">
                      MAX_PAYLOAD: 5MB | FORMATS: .PDF, .DOCX, .PPTX
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf, .doc, .docx, .ppt, .pptx"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files && files.length > 0) handleCatchFiles(files[0])
                    }}
                  />
                </div>
              </div>

              {/* Uploaded File Grid */}
              <SubmissionFileSection
                submittedFiles={submittedFiles}
                handleCatchFiles={handleCatchFiles}
                handleDeleteFiles={handleDeleteFiles}
                handleDownloadFile={handleDownloadFile}
              />

              {/* Example Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
                  Example Submission Description
                </label>
                <div className="border border-white/5 rounded-sm p-4 bg-[#151312]/30 max-h-40 overflow-y-auto">
                  <ReadOnlyEditor content={EXAMPLE_PROJECT_SUMMANRY} />
                </div>
              </div>

              {/* Editor + Live Preview */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
                  Node_Context: Rich_Description
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left: TipTap Editor */}
                  <div className="lg:col-span-8 border border-white/10 rounded-sm overflow-hidden bg-[#151312]">
                    <SimpleEditor
                      initialContent={initialEditorContent}
                      onEditorReady={setEditorValue}
                      limit={STUDENT_SUBMISSION_DESCRIPTION}
                    />
                  </div>
                  {/* Right: Live Preview Panel */}
                  <div className="lg:col-span-4">
                    <SubmissionPreview control={control} />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 border border-[#00e0b3] bg-[#00e0b3]/10 hover:bg-[#00e0b3] hover:text-[#00382b] text-[#00e0b3] font-mono text-xs uppercase font-bold tracking-widest py-3.5 transition-all duration-300 rounded-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">cloud_sync</span>
                  Commit_Submission_Pack
                </button>
                <Link
                  href={`/submission/${groupId}/read-only`}
                  className={`${tw.bg.surfaceContainerHigh} border border-white/10 text-[#b9cbc2] hover:border-white/20 hover:text-white font-mono text-xs uppercase font-bold tracking-widest py-3.5 px-8 text-center transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center`}
                >
                  See your submission
                </Link>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
