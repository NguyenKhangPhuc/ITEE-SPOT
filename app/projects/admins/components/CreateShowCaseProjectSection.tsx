/**
 * PURPOSE:
 * Renders the form section allowing administrators to select an event, group, and challenge,
 * loading any pre-existing project details into the shared edit form.
 *
 * CONTEXT/PARENT FILE:
 * Child component of ProjectsAdminClient.tsx, located at 'app/projects/admins/components/CreateShowCaseProjectSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - eventsWithGroupsAndAwards (EventWithGroupsAndAward[], Required): Event specifications, group lists, and award types.
 * - page (string, Required): Active view indicator.
 */

'use client'

import { useState } from "react"
import { Control, useForm } from "react-hook-form"
import { getSingleProjectByGroupAndChallenge } from "@/app/actions/projects/get/getSingleProjectByGroupAndChallenge"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventWithGroupsAndAward } from "@/app/types/event"
import { GroupWithChallenge } from "@/app/types/group"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsInsert } from "@/app/types/projects"
import { tw } from "@/app/constants/design-tokens"
import EditProjectFormSection from "@/app/components/project-management/EditProjectFormSection"

interface CreateShowCaseProjectSectionProps {
  eventsWithGroupsAndAwards: Array<EventWithGroupsAndAward>
  page: "create" | "manage"
}

export default function CreateShowCaseProjectSection({
  eventsWithGroupsAndAwards,
  page,
}: CreateShowCaseProjectSectionProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const [selectedEvent, setSelectedEvent] = useState<EventWithGroupsAndAward | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<GroupWithChallenge | null>(null)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
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
   * Handles selecting an event. Resets groups, challenges, and form state.
   *
   * PARAMETERS:
   * - eventId (string): Selected event ID.
   */
  const handleSelectEvent = (eventId: string): void => {
    if (!eventId) {
      setSelectedEvent(null)
      setSelectedGroup(null)
      setSelectedChallengeId(null)
      reset()
      return
    }
    const event = eventsWithGroupsAndAwards.find((e) => e.id === eventId) ?? null
    setSelectedEvent(event)
    setSelectedGroup(null)
    setSelectedChallengeId(null)
    reset()
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles group selection. Resets challenge ID and form state.
   *
   * PARAMETERS:
   * - groupId (string): Selected group ID.
   */
  const handleGroupSelect = (groupId: string): void => {
    if (!selectedEvent || !groupId) {
      setSelectedGroup(null)
      setSelectedChallengeId(null)
      reset()
      return
    }
    const group = selectedEvent.groups.find((g) => g.id === groupId) ?? null
    setSelectedGroup(group)
    setSelectedChallengeId(null)
    reset()
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles challenge selection. Loads existing project specifications
   * if they exist in database, resetting form fields.
   *
   * PARAMETERS:
   * - groupChallengeId (string): Selected challenge ID.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleChallengeSelect = async (groupChallengeId: string): Promise<void> => {
    setSelectedChallengeId(groupChallengeId || null)

    if (selectedEvent && selectedGroup && groupChallengeId) {
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
    <div className="w-full flex flex-col gap-6 select-text">
      {/* Event/Group/Challenge select panel */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5`}>

        {/* Row 1: Event & Group dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {/* All Events */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              ALL EVENTS
            </span>
            <div className="relative flex items-center">
              <select
                onChange={(e) => handleSelectEvent(e.target.value)}
                defaultValue=""
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
              >
                <option value="">Choose an Event</option>
                {eventsWithGroupsAndAwards.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title?.toUpperCase() || "UNNAMED_EVENT"}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
          </div>

          {/* Event's Groups */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
              EVENT GROUPS
            </span>
            <div className="relative flex items-center">
              <select
                onChange={(e) => handleGroupSelect(e.target.value)}
                defaultValue=""
                disabled={!selectedEvent}
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">Choose a Group</option>
                {selectedEvent?.groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.group_name?.toUpperCase() || "UNNAMED_GROUP"}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Challenge Dropdown */}
        <div className="flex flex-col gap-1.5 w-full">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            GROUP CHALLENGE CATEGORY
          </span>
          <div className="relative flex items-center">
            <select
              onChange={(e) => handleChallengeSelect(e.target.value)}
              defaultValue=""
              disabled={!selectedGroup}
              className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Choose a Challenge</option>
              {selectedGroup?.group_challenge.map((g) => (
                <option key={g.id ?? ""} value={g.id ?? ""}>
                  {g.event_challenges?.title?.toUpperCase() || "UNNAMED_CHALLENGE"}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
              keyboard_arrow_down
            </span>
          </div>
        </div>

      </div>

      {/* Editing Form */}
      {selectedEvent && selectedGroup && selectedChallengeId && (
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
          control={control as Control}
          eventAwards={selectedEvent.event_awards ?? []}
        />
      )}
    </div>
  )
}
