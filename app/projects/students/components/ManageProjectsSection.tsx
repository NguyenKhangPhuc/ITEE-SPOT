/**
 * PURPOSE:
 * Renders the project submissions management registry table.
 * Allows students to filter/sort their own projects, load details into the editor,
 * and view live submission previews.
 *
 * CONTEXT/PARENT FILE:
 * Child component of StudentsManagementClient.tsx, located at 'app/projects/students/components/ManageProjectsSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - page (string, Required): Active view indicator.
 * - userProjects (ProjectsSummaryExtended[], Required): Preloaded list of user submitted projects.
 * - setUserProjects (React.Dispatch<React.SetStateAction<ProjectsSummaryExtended[]>>, Required): State setter for projects list.
 * - userId (string, Required): Authenticated user ID.
 */

'use client'

import { useState } from "react"
import { Control, useForm } from "react-hook-form"
import Link from "next/link"
import type { getUserSubmittedProjects } from "@/app/actions/projects/get/getUserSubmittedProjects"
import type { getSingleProjectByGroupAndChallenge } from "@/app/actions/projects/get/getSingleProjectByGroupAndChallenge"
import type { getPublicFileURL } from "@/app/actions/file_url"
import type { saveStudentGroupProject } from "@/app/actions/projects/post/saveStudentGroupProject"
import { PROJECT_STATUS } from "@/app/types/enum"
import { EventAwards } from "@/app/types/event_awards"
import { ProjectAwardsInsert } from "@/app/types/project_awards"
import { ProjectFileExtended } from "@/app/types/project_files"
import { ProjectsSummaryExtended, ProjectsInsert } from "@/app/types/projects"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { tw } from "@/app/constants/design-tokens"
import EditProjectFormSection from "@/app/components/project-management/EditProjectFormSection"

interface ManageProjectsSectionProps {
  page: "create" | "manage"
  userProjects: Array<ProjectsSummaryExtended>
  setUserProjects: React.Dispatch<React.SetStateAction<Array<ProjectsSummaryExtended>>>
  userId: string
  actions: {
    getUserSubmittedProjects: typeof getUserSubmittedProjects
    getSingleProjectByGroupAndChallenge: typeof getSingleProjectByGroupAndChallenge
    getPublicFileURL: typeof getPublicFileURL
    saveStudentGroupProject: typeof saveStudentGroupProject
  }
}

export default function ManageProjectsSection({
  page,
  userProjects,
  setUserProjects,
  userId,
  actions,
}: ManageProjectsSectionProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const [chosenProject, setChosenProject] = useState<ProjectsSummaryExtended | null>(null)
  const [chosenStatus, setChosenStatus] = useState<PROJECT_STATUS | null>(null)
  const [chosenOrder, setChosenOrder] = useState<boolean>(false)
  const [eventAwards, setEventAwards] = useState<EventAwards[]>([])
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
   * Triggers when status filter is modified. Queries user's submitted projects
   * matching status and order.
   *
   * PARAMETERS:
   * - status (PROJECT_STATUS | null): Target project status choice.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleFilterProjectStatus = async (status: PROJECT_STATUS | null): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { data, error } = await actions.getUserSubmittedProjects({
        userId,
        status,
        ascending: chosenOrder,
      })
      if (error) {
        throw new Error(error)
      }
      setUserProjects(data ?? [])
      setChosenStatus(status)
      showNotification("Filter successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to filter project registry.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers when order sorting is modified. Queries user's submitted projects
   * matching status and order.
   *
   * PARAMETERS:
   * - ascending (boolean): True for oldest first, false for newest first.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleFilterProjectOrder = async (ascending: boolean): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { data, error } = await actions.getUserSubmittedProjects({
        userId,
        status: chosenStatus,
        ascending,
      })
      if (error) {
        throw new Error(error)
      }
      setUserProjects(data ?? [])
      setChosenOrder(ascending)
      showNotification("Filter successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to sort project registry.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Assigns specific text colors matching the active status type.
   *
   * PARAMETERS:
   * - status (string | null): The project status value.
   *
   * RETURNS:
   * - string: Tailwind color classes.
   */
  const handleGettingStatusColor = (status: string | null): string => {
    switch (status) {
      case PROJECT_STATUS.ACCEPTED:
        return "text-[#00e0b3]"
      case PROJECT_STATUS.PENDING:
        return "text-yellow-500/80"
      case PROJECT_STATUS.REJECTED:
        return "text-red-400"
      default:
        return "text-[#83958d]"
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Loads specific project's data into the form fields.
   *
   * PARAMETERS:
   * - project (ProjectsSummaryExtended): Target project row.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleChooseProject = async (project: ProjectsSummaryExtended): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { data, error } = await actions.getSingleProjectByGroupAndChallenge({
        group_id: project.group_id!,
        group_challenge_id: project.group_challenge_id!,
      })
      if (error) {
        throw new Error(error)
      }
      if (data) {
        reset(data)
        setChosenProject(project)
        setEventAwards(data.groups?.events?.event_awards ?? [])
        setSubmittedFiles(data.project_files)
        setSelectedAward(data.project_awards)
        setInitialEditorContent(data.description ?? "")
      } else {
        throw new Error("Failed to load project details.")
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

  if (page !== "manage") {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Registry Panel */}
      <div className="flex flex-col gap-4">
        {/* Registry Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00e0b3]" />
            <span>01_SUBMISSION_REGISTRY</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="relative flex items-center min-w-[150px]">
              <select
                onChange={(e) => {
                  const val = e.target.value
                  handleFilterProjectStatus(val === "" ? null : (val as PROJECT_STATUS))
                }}
                value={chosenStatus ?? ""}
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-[10px] p-2.5 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
              >
                <option value="">ALL STATUSES</option>
                {Object.values(PROJECT_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>

            {/* Order Sort */}
            <div className="relative flex items-center min-w-[200px]">
              <select
                onChange={(e) => handleFilterProjectOrder(e.target.value === "true")}
                value={chosenOrder.toString()}
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-[10px] p-2.5 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
              >
                <option value="false">NEWEST FIRST (DESCENDING)</option>
                <option value="true">OLDEST FIRST (ASCENDING)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 text-xs text-[#83958d] pointer-events-none">
                keyboard_arrow_down
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-x-auto`}>
          <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider">
                <th className="p-4 font-bold text-center w-12">NO</th>
                <th className="p-4 font-bold">EVENT_NODE</th>
                <th className="p-4 font-bold">GROUP_NAME</th>
                <th className="p-4 font-bold">PROJECT_TITLE</th>
                <th className="p-4 font-bold text-center w-28">STATUS</th>
                <th className="p-4 font-bold text-center w-24">ACTION</th>
                <th className="p-4 font-bold text-right w-28">PREVIEW</th>
              </tr>
            </thead>
            <tbody>
              {userProjects.length > 0 ? (
                userProjects.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-4 text-center font-bold text-[#83958d]">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="p-4 text-[#e8e1df] font-semibold max-w-[150px] truncate uppercase">
                      {item.groups?.events?.title || "UNNAMED_EVENT"}
                    </td>
                    <td className="p-4 max-w-[150px] truncate uppercase">
                      {item.groups?.group_name || "UNNAMED_GROUP"}
                    </td>
                    <td className="p-4 font-bold text-[#e8e1df] max-w-[200px] truncate">
                      {item.project_title || "Untitled Project"}
                    </td>
                    <td className={`p-4 text-center font-bold uppercase tracking-wider ${handleGettingStatusColor(item.project_status)}`}>
                      {item.project_status || "UNKNOWN"}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleChooseProject(item)}
                        type="button"
                        className="text-[#00e0b3] hover:text-[#00e0b3]/80 transition-colors font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer"
                      >
                        [EDIT]
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={
                          item.project_status === PROJECT_STATUS.ACCEPTED
                            ? `/projects/${item.id}`
                            : `/projects/${item.id}/pending`
                        }
                        className="text-[#00e0b3] hover:underline font-bold text-[9px] uppercase tracking-wider"
                      >
                        VIEW_DETAILS
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#83958d] select-none">
                    NO PROJECT SUBMISSIONS RECORDED
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Form Edit Area */}
      {chosenProject && (
        <div className="border-t border-white/5 pt-8 mt-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider select-none mb-6">
            <div className="w-[3px] h-3 bg-[#00e0b3]" />
            <span>02_EDIT_PROJECT: {chosenProject.project_title?.toUpperCase()}</span>
          </div>
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
            eventAwards={eventAwards}
            actions={actions}
          />
        </div>
      )}
    </div>
  )
}
