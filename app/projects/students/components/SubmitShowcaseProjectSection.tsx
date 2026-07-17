/**
 * PURPOSE:
 * Renders the form section allowing students to select a group and challenge,
 * loading any pre-existing project details into the custom edit form.
 *
 * CONTEXT/PARENT FILE:
 * Child component of StudentsManagementClient.tsx, located at 'app/projects/students/components/SubmitShowcaseProjectSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - groupsWithEvents (UserGroupsWithEvent[], Required): List of groups user participated in.
 * - page (string, Required): Active view indicator.
 */

'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { getSingleProjectByGroupAndChallenge } from "@/app/actions/projects"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { UserGroupsWithEvent } from "@/app/types/group"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsInsert } from "@/app/types/projects"
import { tw } from "@/app/constants/design-tokens"
import EditProjectFormSection from "@/app/components/project-management/EditProjectFormSection"

interface SubmitShowcaseProjectSectionProps {
  groupsWithEvents: Array<UserGroupsWithEvent>
  page: "create" | "manage"
}

export default function SubmitShowcaseProjectSection({
  groupsWithEvents,
  page,
}: SubmitShowcaseProjectSectionProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()
  const [selectedGroup, setSelectedGroup] = useState<UserGroupsWithEvent | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)
  const [initialEditorContent, setInitialEditorContent] = useState<string>("")
  const [submittedFiles, setSubmittedFiles] = useState<ProjectFileExtended[]>([])
  const [selectedAward, setSelectedAward] = useState<Array<ProjectAwardsInsert>>([])

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<ProjectsInsert>()

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers when group selection is modified. Resolves target group object,
   * resets challenge selection and form state.
   *
   * PARAMETERS:
   * - groupId (string): Selected group identifier.
   */
  const handleGroupSelect = (groupId: string): void => {
    if (!groupId) {
      setSelectedGroup(null)
      setSelectedChallenge(null)
      reset()
      return
    }
    const group = groupsWithEvents.find((g) => g.id === groupId) ?? null
    setSelectedGroup(group)
    setSelectedChallenge(null)
    reset()
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers when challenge selection is modified. Fetches existing project registry parameters
   * from the database if they exist, resetting form states, preloaded files, and awards.
   *
   * PARAMETERS:
   * - groupChallengeId (string): Selected challenge ID.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleChallengeSelect = async (groupChallengeId: string): Promise<void> => {
    setSelectedChallenge(groupChallengeId || null)

    if (groupChallengeId && selectedGroup) {
      setIsOpenLoader(true)
      try {
        const { data, error } = await getSingleProjectByGroupAndChallenge({
          group_id: selectedGroup.id,
          group_challenge_id: groupChallengeId,
        })
        if (error) {
          throw new Error(error)
        }
        if (data) {
          reset(data)
          setSubmittedFiles(data.project_files)
          setSelectedAward(data.project_awards)
          setInitialEditorContent(data.description ?? "")
        } else {
          reset({
            id: undefined,
            github_link: "",
            youtube_link: "",
            short_description: "",
            group_challenge_id: groupChallengeId,
            group_id: selectedGroup.id,
            created_at: undefined,
          })
          setInitialEditorContent("")
          setSelectedAward([])
          setSubmittedFiles([])
        }
        showNotification("Select successfully")
      } catch (error) {
        if (error instanceof Error) {
          showNotification(error.message)
        } else {
          showNotification("Failed to fetch project specifications.")
        }
      } finally {
        setIsOpenLoader(false)
      }
    }
  }

  if (page !== "create") {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Group & Challenge Selector Panel */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-6`}>
        
        {/* Participated Groups */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            YOUR PARTICIPATED GROUPS
          </span>
          <div className="relative flex items-center">
            <select
              onChange={(e) => handleGroupSelect(e.target.value)}
              defaultValue=""
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
            >
              <option value="">Choose a Group</option>
              {groupsWithEvents.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_name?.toUpperCase() || "UNNAMED_GROUP"}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

        {/* Challenges Selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            CHALLENGE CATEGORY
          </span>
          <div className="relative flex items-center">
            <select
              onChange={(e) => handleChallengeSelect(e.target.value)}
              defaultValue=""
              disabled={!selectedGroup}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Choose a Challenge</option>
              {selectedGroup?.challenges.map((gc) => (
                <option key={gc.id ?? ""} value={gc.id ?? ""}>
                  {gc.event_challenges?.title?.toUpperCase() || "UNNAMED_CHALLENGE"}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

      </div>

      {/* Editing Form Section */}
      {selectedGroup && selectedChallenge && (
        <EditProjectFormSection
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          submittedFiles={submittedFiles}
          setSubmittedFiles={setSubmittedFiles}
          selectedAward={selectedAward}
          setSelectedAward={setSelectedAward}
          initialEditorContent={initialEditorContent}
          setInitialEditorContent={setInitialEditorContent}
          control={control}
          eventAwards={selectedGroup.events?.event_awards ?? []}
        />
      )}
    </div>
  )
}
