/**
 * PURPOSE:
 * Client Component for the Admin Projects Management Dashboard.
 * Manages active navigation tabs (Create Showcase Project vs Managing Projects)
 * and loads all showcase projects from the database on-demand.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/projects/admins/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - eventsWithGroupsAndAwards (EventWithGroupsAndAward[], Required): Event specifications, group lists, and award types.
 */

'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProjectsSummary } from "@/app/types/projects"
import { EventWithGroupsAndAward } from "@/app/types/event"
import { getAllProjects } from "@/app/actions/projects/get/getAllProjects"
import type { getAllProjectsBasedOnStatus } from "@/app/actions/projects/get/getAllProjectsBasedOnStatus"
import type { getSingleProjectByGroupAndChallenge } from "@/app/actions/projects/get/getSingleProjectByGroupAndChallenge"
import type { updateProjectStatus } from "@/app/actions/projects/put/updateProjectStatus"
import type { getPublicFileURL } from "@/app/actions/file_url"
import type { saveStudentGroupProject } from "@/app/actions/projects/post/saveStudentGroupProject"
import { useNotification } from "@/app/context/NotificationContext"
import BackButton from "@/app/components/BackButton"
import CreateShowCaseProjectSection from "./components/CreateShowCaseProjectSection"
import AdminProjectManageSection from "./components/AdminProjectManageSection"

type PageType = "create" | "manage"

interface ProjectsAdminClientProps {
  eventsWithGroupsAndAwards: Array<EventWithGroupsAndAward>
  actions: {
    getAllProjectsBasedOnStatus: typeof getAllProjectsBasedOnStatus
    getSingleProjectByGroupAndChallenge: typeof getSingleProjectByGroupAndChallenge
    updateProjectStatus: typeof updateProjectStatus
    getPublicFileURL: typeof getPublicFileURL
    saveStudentGroupProject: typeof saveStudentGroupProject
  }
}

export default function ProjectsAdminClient({
  eventsWithGroupsAndAwards,
  actions,
}: ProjectsAdminClientProps) {
  const { showNotification } = useNotification()
  const [currentPage, setCurrentPage] = useState<PageType>("create")
  const [currentProjects, setCurrentProjects] = useState<Array<ProjectsSummary>>([])
  const [hasLoadedProjects, setHasLoadedProjects] = useState<boolean>(false)
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false)

  /**
   * BEHAVIORAL MECHANISM:
   * Handles switching tabs. If the target tab is 'manage' and project registry
   * data has not been fetched yet, triggers getAllProjects server action
   * with loading states.
   *
   * PARAMETERS:
   * - tab (PageType): The target tab view to transition to.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleTabChange = async (tab: PageType): Promise<void> => {
    setCurrentPage(tab)
    if (tab === "manage" && !hasLoadedProjects) {
      setIsLoadingProjects(true)
      try {
        const { data, error } = await getAllProjects()
        if (error) {
          throw new Error(error)
        }
        setCurrentProjects(data ?? [])
        setHasLoadedProjects(true)
      } catch (error) {
        if (error instanceof Error) {
          showNotification(error.message)
        } else {
          showNotification("Failed to fetch showcase projects registry.")
        }
      } finally {
        setIsLoadingProjects(false)
      }
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Back navigation button */}
      <BackButton />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
        <div className="flex gap-4 items-stretch">
          <div className="w-[3px] bg-[#00e0b3]" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              ADMIN_PORTAL // SHOWCASE_PROJECTS
            </span>
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              MANAGE_SHOWCASE_PROJECTS
            </h1>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [ADMIN_NODE_ACTIVE]
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#1a1817] p-1 rounded-sm border border-white/5 select-none w-full">
        {(["create", "manage"] as PageType[]).map((tab) => {
          const isActive = currentPage === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`w-full text-center py-3 font-mono text-[10px] uppercase font-bold tracking-widest transition-all duration-300 rounded-sm relative select-none cursor-pointer ${
                isActive ? "text-[#00382b]" : "text-[#b9cbc2] hover:text-[#e8e1df]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="adminProjectsTabActiveIndicator"
                  className="absolute inset-0 bg-[#00e0b3] rounded-sm z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab === "create" ? "Create / Edit Project" : "Managing Projects"}
              </span>
            </button>
          )
        })}
      </div>

      {/* Configuration Viewport */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {currentPage === "create" && (
              <CreateShowCaseProjectSection
                page={currentPage}
                eventsWithGroupsAndAwards={eventsWithGroupsAndAwards}
              />
            )}
            {currentPage === "manage" && (
              <div className="w-full flex flex-col">
                {isLoadingProjects ? (
                  <div className="w-full p-12 text-center select-none flex flex-col items-center justify-center gap-2 text-[#83958d]">
                    <span className="w-6 h-6 border-2 border-[#00e0b3] border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                      RETRIEVING_REGISTRY_DATA...
                    </span>
                  </div>
                ) : (
                  <AdminProjectManageSection
                    page={currentPage}
                    currentProjects={currentProjects}
                    setCurrentProjects={setCurrentProjects}
                    actions={actions}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}