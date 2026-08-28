/**
 * PURPOSE:
 * Shared reusable Project Details Editing Form (specifications, links, video preview,
 * file attachments, and award selections).
 *
 * CONTEXT/PARENT FILE:
 * Moved to a shared folder at 'app/components/project-management/EditProjectFormSection.tsx'.
 * Used by students/components/SubmitShowcaseProjectSection, students/components/ManageProjectsSection,
 * and admins/components/AdminProjectManageSection.
 *
 * INPUTS / PARAMETERS:
 * - submittedFiles (ProjectFileExtended[], Required): File list uploaded/to be uploaded.
 * - setSubmittedFiles (React.Dispatch, Required): File state setter.
 * - selectedAward (ProjectAwardsInsert[], Required): Active awards selected.
 * - setSelectedAward (React.Dispatch, Required): Active awards state setter.
 * - initialEditorContent (string, Required): Tiptap document content.
 * - setInitialEditorContent (React.Dispatch, Required): Document content setter.
 * - register (UseFormRegister, Required): Form field register hook.
 * - errors (FieldErrors, Required): Form validation error messages.
 * - handleSubmit (UseFormHandleSubmit, Required): Form submit trigger.
 * - control (Control, Required): Form control context hook.
 * - eventAwards (EventAwardsInsert[], Required): Available event awards.
 */

'use client'

import React, { SetStateAction, useState } from "react"
import { Control, FieldErrors, UseFormHandleSubmit, UseFormRegister, useWatch } from "react-hook-form"
import Link from "next/link"
import { Editor } from "@tiptap/core"
import { getPublicFileURL } from "@/app/actions/file_url"
import { saveStudentGroupProject } from "@/app/actions/projects/post/saveStudentGroupProject"
import WordCounter from "@/app/components/WordCounter"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { MAX_TOTAL_SIZE, SHORT_DESCRIPTION_LENGTH, STUDENT_SUBMISSION_DESCRIPTION } from "@/app/constants"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import SubmissionFileSection from "@/app/components/file-management/SubmissionFileSection"
import { EventAwardsInsert } from "@/app/types/event_awards"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsInsert } from "@/app/types/projects"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { tw } from "@/app/constants/design-tokens"

interface EditProjectFormSectionProps {
  submittedFiles: ProjectFileExtended[]
  setSubmittedFiles: React.Dispatch<SetStateAction<ProjectFileExtended[]>>
  selectedAward: Array<ProjectAwardsInsert>
  setSelectedAward: React.Dispatch<SetStateAction<Array<ProjectAwardsInsert>>>
  initialEditorContent: string
  setInitialEditorContent: React.Dispatch<SetStateAction<string>>
  register: UseFormRegister<ProjectsInsert>
  errors: FieldErrors<ProjectsInsert>
  handleSubmit: UseFormHandleSubmit<ProjectsInsert>
  control: Control
  eventAwards: EventAwardsInsert[]
}

export default function EditProjectFormSection({
  register,
  errors,
  handleSubmit,
  submittedFiles,
  setSubmittedFiles,
  selectedAward,
  setSelectedAward,
  initialEditorContent,
  control,
  eventAwards,
}: EditProjectFormSectionProps) {
  const [editorValue, setEditorValue] = useState<Editor | null>(null)
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  // Watch the ID property to check if the project has been saved to allow previews
  const projectId = useWatch({ control, name: "id" })
  const projectStatus = useWatch({ control, name: "project_status" })

  /**
   * BEHAVIORAL MECHANISM:
   * Handles catching and validating local file selection. Enforces the 5MB size limit.
   *
   * PARAMETERS:
   * - file (File): The chosen local file.
   */
  const handleCatchFiles = (file: File): void => {
    const currentFilesSize = submittedFiles.reduce((acc, f) => acc + (f.size ?? 0), 0)
    if (currentFilesSize + file.size > MAX_TOTAL_SIZE) {
      showNotification("Total files size exceeds 5MB limit.")
    } else {
      const newFile: ProjectFileExtended = {
        original_file_name: file.name,
        size: file.size,
        mime_type: file.type,
        file: file,
      }
      setSubmittedFiles([...submittedFiles, newFile])
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Removes a file attachment choice from local state array.
   *
   * PARAMETERS:
   * - fileIndex (number): Target index to remove.
   */
  const handleDeleteFiles = (fileIndex: number): void => {
    const updatedFiles = submittedFiles.filter((_, index) => index !== fileIndex)
    setSubmittedFiles(updatedFiles)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers a browser download of the attached file. Resolves public URLs
   * for remote storage or creates local URLs for new unsaved selections.
   *
   * PARAMETERS:
   * - file (ProjectFileExtended): Target file registry item.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleDownloadFile = async (file: ProjectFileExtended): Promise<void> => {
    if (file.storage_path) {
      try {
        const { data, error } = await getPublicFileURL(file.storage_path)
        if (error) {
          throw new Error(error)
        }
        if (data?.publicUrl) {
          window.open(data.publicUrl, "_blank")
        } else {
          throw new Error("Failed to load public download path.")
        }
      } catch (error) {
        if (error instanceof Error) {
          showNotification(error.message)
        } else {
          showNotification("Failed to resolve file link.")
        }
      }
    } else if (file.file) {
      const localUrl = URL.createObjectURL(file.file)
      window.open(localUrl, "_blank")
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Asserts whether a given award ID is already selected.
   *
   * PARAMETERS:
   * - awardId (string): The award identifier.
   *
   * RETURNS:
   * - boolean: True if checked.
   */
  const handleCheckIsSelected = (awardId: string): boolean => {
    return selectedAward.some((ele) => ele.award_id === awardId)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Toggles the award choice state in the selection array.
   *
   * PARAMETERS:
   * - awardId (string): The target award ID.
   */
  const handleSelectingAward = (awardId: string): void => {
    if (handleCheckIsSelected(awardId)) {
      const filteredOutAward = selectedAward.filter((ele) => ele.award_id !== awardId)
      setSelectedAward(filteredOutAward)
    } else {
      const newAward: ProjectAwardsInsert = {
        award_id: awardId,
      }
      setSelectedAward([...selectedAward, newAward])
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Submits the project updates to database. Formats description content using Tiptap HTML.
   *
   * PARAMETERS:
   * - project (ProjectsInsert): Project form field payload.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSaveProject = async (project: ProjectsInsert): Promise<void> => {
    setIsOpenLoader(true)
    try {
      project.description = editorValue?.getHTML()
      const { data, error } = await saveStudentGroupProject({
        project,
        submittedFiles,
        projectAwards: selectedAward,
      })
      if (error) {
        throw new Error(error)
      }
      showNotification("Update successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to save project specifications.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-6 w-full select-text"
      onSubmit={handleSubmit(handleSaveProject)}
    >
      <input type="hidden" {...register("id")} />
      <input type="hidden" {...register("group_id")} />
      <input type="hidden" {...register("group_challenge_id")} />

      {/* Inputs block: Grid container */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5`}>

        {/* Project Title */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            PROJECT TITLE
          </span>
          <input
            type="text"
            autoComplete="off"
            placeholder="e.g. CLOUD STORAGE ENGINE"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
            {...register("project_title", { required: "Project title is required" })}
          />
          {errors.project_title && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] {errors.project_title.message}
            </span>
          )}
        </div>

        {/* Links row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {/* GitHub link */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              GITHUB SOURCE CODE LINK
            </span>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 flex items-center pointer-events-none select-none">
                <svg className="w-4 h-4 text-[#83958d]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </span>
              <input
                type="text"
                autoComplete="off"
                placeholder="e.g. https://github.com/..."
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs pl-10 pr-3 py-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("github_link", { required: "Github link is required" })}
              />
            </div>
            {errors.github_link && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.github_link.message}
              </span>
            )}
          </div>

          {/* YouTube link */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              DEMO VIDEO LINK (YOUTUBE)
            </span>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 flex items-center pointer-events-none select-none">
                <svg className="w-4 h-4 text-[#83958d]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.028 0 12 0 12s0 3.972.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.972 24 12 24 12s0-3.972-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </span>
              <input
                type="text"
                autoComplete="off"
                placeholder="e.g. https://youtube.com/..."
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs pl-10 pr-3 py-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("youtube_link")}
              />
            </div>
            {errors.youtube_link && (
              <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                [!] {errors.youtube_link.message}
              </span>
            )}
          </div>
        </div>

        {/* Youtube Video Preview component */}
        <div className="w-full">
          <YoutubeVideo control={control} />
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            ABSTRACT (SHORT DESCRIPTION)
          </span>
          <textarea
            maxLength={SHORT_DESCRIPTION_LENGTH}
            autoComplete="off"
            placeholder="Short abstract description..."
            rows={3}
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full resize-none"
            {...register("short_description", { required: "Short description is required" })}
          />
          {errors.short_description && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] {errors.short_description.message}
            </span>
          )}
          <div className="flex justify-end select-none">
            <WordCounter control={control} fieldName="short_description" limit={200} />
          </div>
        </div>

        {/* Awards Selection grid */}
        {eventAwards.length > 0 && (
          <div className="flex flex-col gap-2 w-full select-none">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              CHOOSE YOUR TARGET AWARDS / GOALS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventAwards.map((award) => {
                const isSelected = handleCheckIsSelected(award.id ?? "")
                return (
                  <button
                    key={`award-${award.id}`}
                    type="button"
                    onClick={() => handleSelectingAward(award.id ?? "")}
                    className={`p-4 text-center font-mono text-[9px] uppercase tracking-wider font-bold transition-all duration-300 border rounded-sm cursor-pointer ${isSelected
                        ? "bg-[#00e0b3] text-[#00382b] border-[#00e0b3]"
                        : "bg-[#151312] border-[#00e0b3]/10 hover:border-[#00e0b3]/30 hover:bg-[#00e0b3]/5 text-[#b9cbc2]"
                      }`}
                  >
                    {award.award_title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Rich text specification editor */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center select-none">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
              FULL PROJECT SPECIFICATIONS
            </span>
          </div>
          <div className="w-full bg-[#151312] border border-white/5 rounded-sm overflow-hidden select-text text-black">
            <SimpleEditor
              initialContent={initialEditorContent}
              onEditorReady={setEditorValue}
              limit={STUDENT_SUBMISSION_DESCRIPTION}
            />
          </div>
        </div>

        {/* File Attachments section */}
        <div className="flex flex-col gap-4 w-full pt-2">
          {/* dashed Dropzone */}
          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest block font-bold select-none">
              PROJECT PAYLOAD (ATTACHMENTS / ARCHIVE)
            </span>
            <div className="relative w-full h-28 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center hover:border-[#00e0b3]/30 transition-colors group">
              <div className="text-center flex flex-col items-center justify-center gap-1.5 pointer-events-none select-none">
                <span className="material-symbols-outlined text-xl text-[#83958d] group-hover:text-[#00e0b3] transition-colors">
                  cloud_upload
                </span>
                <p className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider">
                  Drag & Drop project archive or{" "}
                  <span className="text-[#00e0b3] font-semibold underline decoration-dotted">
                    browse filesystem
                  </span>
                </p>
                <p className="text-[7px] font-mono text-[#83958d]/50 uppercase">
                  MAX_PAYLOAD: 5MB | ALL FORMATS
                </p>
              </div>
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    Array.from(files).forEach((file) => handleCatchFiles(file))
                  }
                }}
              />
            </div>
          </div>

          <SubmissionFileSection
            submittedFiles={submittedFiles}
            handleDeleteFiles={handleDeleteFiles}
            handleDownloadFile={handleDownloadFile}
          />
        </div>

      </div>

      {/* Bottom Action buttons */}
      <div className="flex gap-4 select-none mt-2">
        <button
          type="submit"
          className="w-1/2 py-3 bg-[#00e0b3] text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm font-bold">save</span>
          SAVE SUBMISSION
        </button>

        {projectId ? (
          <Link
            href={
              projectStatus === "accepted" ? `/projects/${projectId}` : `/projects/${projectId}/pending`
            }
            className="w-1/2 py-3 bg-[#151312] border border-[#00e0b3]/20 hover:border-[#00e0b3]/50 hover:bg-[#00e0b3]/5 transition-all text-[#00e0b3] font-mono text-xs uppercase font-bold tracking-widest rounded-sm cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            VIEW PROJECT DETAIL
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="w-1/2 py-3 bg-white/5 border border-white/5 text-[#83958d] font-mono text-xs uppercase font-bold tracking-widest rounded-sm cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">lock</span>
            PROJECT_UNPUBLISHED
          </button>
        )}
      </div>

    </form>
  )
}
