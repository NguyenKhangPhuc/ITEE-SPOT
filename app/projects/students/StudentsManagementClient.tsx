/**
 * PURPOSE:
 * Client Component for the Student Projects Management Dashboard.
 * Manages active configurations tabs (Create/Edit Project vs Managing Projects)
 * and loads user submitted projects on-demand from the database.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/projects/students/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - groupsWithEvents (UserGroupsWithEvent[], Required): List of groups user participated in.
 * - userId (string, Required): The authenticated user ID.
 */

'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProjectsSummaryExtended } from "@/app/types/projects"
import { UserGroupsWithEvent } from "@/app/types/group"
import { runProjectAction } from "@/app/actions/projects/actions.gateway"
import { useNotification } from "@/app/context/NotificationContext"
import BackButton from "@/app/components/BackButton"
import SubmitShowcaseProjectSection from "./components/SubmitShowcaseProjectSection"
import ManageProjectsSection from "./components/ManageProjectsSection"

type PageType = "create" | "manage"

interface StudentsManagementClientProps {
  groupsWithEvents: Array<UserGroupsWithEvent>
  userId: string
}

export default function StudentsManagementClient({
  groupsWithEvents,
  userId,
}: StudentsManagementClientProps) {
  const { showNotification } = useNotification()
  const [currentPage, setCurrentPage] = useState<PageType>("create")
  const [userProjects, setUserProjects] = useState<Array<ProjectsSummaryExtended>>([])
  const [hasLoadedProjects, setHasLoadedProjects] = useState<boolean>(false)
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false)

  /**
   * BEHAVIORAL MECHANISM:
   * Handles switching tabs. If the target tab is 'manage' and user projects
   * have not been fetched yet, triggers getUserSubmittedProjects server action
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
        const { data, error } = await runProjectAction({
          type: 'getUserSubmittedProjects',
          payload: {
            userId,
            status: null,
            ascending: false,
          }
        })
        if (error) {
          throw new Error(error)
        }
        setUserProjects(data ?? [])
        setHasLoadedProjects(true)
      } catch (error) {
        if (error instanceof Error) {
          showNotification(error.message)
        } else {
          showNotification("Failed to fetch submitted projects registry.")
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
              SYSTEM_REGISTRY // PROJECT_SUBMISSION
            </span>
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              MANAGE_SUBMISSIONS
            </h1>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [SUBMISSION_NODE_ACTIVE]
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
                  layoutId="studentProjectsTabActiveIndicator"
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
              <SubmitShowcaseProjectSection
                groupsWithEvents={groupsWithEvents}
                page={currentPage}
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
                  <ManageProjectsSection
                    page={currentPage}
                    userProjects={userProjects}
                    setUserProjects={setUserProjects}
                    userId={userId}
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
