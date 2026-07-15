'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ProjectsSummaryExtended } from "../types/projects"
import { EventInsert } from "../types/event"
import { ProjectFilter } from "../types/group"
import { AWARD_TYPE } from "../types/enum"
import Pagination from "@/app/helpers/Pagination"
import { createClient } from "@/app/utils/supabase/client"
import { handleGetUrl } from "@/app/helpers/FileUrl"
import { tw } from "@/app/constants/design-tokens"
import AwardProjectCard from "./components/AwardProjectCard"
import ParticipantProjectCard from "./components/ParticipantProjectCard"
import ProjectFilterModal from "./components/ProjectFilterModal"
import BackButton from "@/app/components/BackButton"

interface ProjectsClientProps {
  projects: Array<ProjectsSummaryExtended> | null
  events: Array<EventInsert>
}

/**
 * PURPOSE:
 * Client Component that orchestrates the Projects Archive Gallery view. It partitions projects
 * into General Awards, Specific Awards, and Participants categories, renders them using dark
 * terminal-themed layout patterns, provides a rethemed event filter modal, and coordinates
 * unified client-side pagination. It delegates card rendering and filtering UI to modular subcomponents.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/projects/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - projects (Array<ProjectsSummaryExtended> | null, Required): List of accepted project submissions.
 * - events (Array<EventInsert>, Required): Complete list of contest events for filtering.
 */
export default function ProjectsClient({ projects, events }: ProjectsClientProps) {
  const supabase = createClient()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [currentProjects, setCurrentProjects] = useState<Array<ProjectsSummaryExtended>>(projects || [])
  const [currentPage, setCurrentPage] = useState<number>(1)

  // React Hook Form for filters
  const { register, handleSubmit, reset } = useForm<ProjectFilter>({
    defaultValues: {
      events: [],
    },
  })

  // 1. Partition projects by award classification based strictly on highest priority (General > Specific > Participant/None)
  const generalProjects = currentProjects.filter((pro) =>
    pro.project_awards.some((a) => a.event_awards?.award_type === AWARD_TYPE.GENERAL)
  )

  const specificProjects = currentProjects.filter((pro) =>
    !pro.project_awards.some((a) => a.event_awards?.award_type === AWARD_TYPE.GENERAL) &&
    pro.project_awards.some((a) => a.event_awards?.award_type === AWARD_TYPE.SPECIFIC)
  )

  const participantProjects = currentProjects.filter((pro) =>
    !pro.project_awards.some((a) =>
      a.event_awards?.award_type === AWARD_TYPE.GENERAL ||
      a.event_awards?.award_type === AWARD_TYPE.SPECIFIC
    )
  )

  // 2. Client-side Pagination parameters
  const generalLimit = 2
  const specificLimit = 2
  const participantLimit = 4

  const paginatedGeneral = generalProjects.slice((currentPage - 1) * generalLimit, currentPage * generalLimit)
  const paginatedSpecific = specificProjects.slice((currentPage - 1) * specificLimit, currentPage * specificLimit)
  const paginatedParticipants = participantProjects.slice((currentPage - 1) * participantLimit, currentPage * participantLimit)

  const totalPages = Math.max(
    1,
    Math.ceil(generalProjects.length / generalLimit),
    Math.ceil(specificProjects.length / specificLimit),
    Math.ceil(participantProjects.length / participantLimit)
  )

  /**
   * BEHAVIORAL MECHANISM:
   * Handles filter form submissions. It filters the projects array by event ID.
   *
   * PARAMETERS:
   * - data (ProjectFilter): Checkbox selection form data.
   *
   * RETURNS:
   * - void
   */
  const onSubmit = (data: ProjectFilter) => {
    if (data.events.length === 0) {
      setCurrentProjects(projects || [])
    } else {
      const filtered = (projects || []).filter((project) =>
        data.events.includes(project.groups?.event_id ?? "")
      )
      setCurrentProjects(filtered)
    }
    setCurrentPage(1)
    setIsOpen(false)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Resets all event checkboxes and displays the complete list of projects.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleResetFilter = () => {
    reset()
    setCurrentProjects(projects || [])
    setCurrentPage(1)
    setIsOpen(false)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Resolve cover image helper prioritizing group poster over event poster.
   *
   * PARAMETERS:
   * - project (ProjectsSummaryExtended): Project object query node.
   *
   * RETURNS:
   * - string | null: Resolved URL from Supabase storage or null if no poster is found.
   */
  const resolveCoverUrl = (project: ProjectsSummaryExtended) => {
    const path = project.groups?.poster_path || project.groups?.events?.poster_path
    if (path) {
      return handleGetUrl(supabase, path)
    }
    return null
  }

  return (
    <div className="w-full flex flex-col gap-8 min-h-screen">
      <BackButton />

      {/* Title & Filter Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#83958d] uppercase tracking-wider">
            <span className="px-1.5 py-0.5 border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm font-bold text-[8px]">
              SYSTEM ARCHIVE
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase leading-tight font-mono text-[#e8e1df]">
            PROJECT_ARCHIVE: <span className="text-[#00e0b3]">INNOVATION_GALLERY</span>
          </h1>

          <p className="text-xs font-mono text-[#83958d] leading-relaxed">
            Operational archive of accepted student project submissions and system showcase registries.
          </p>
        </div>

        {/* Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="border border-[#e8e1df]/20 hover:border-[#00e0b3]/30 bg-[#151312] hover:bg-[#00e0b3]/5 text-[#e8e1df] hover:text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest px-6 py-3.5 transition-all duration-300 rounded-sm cursor-pointer flex items-center gap-2 self-start md:self-center shrink-0"
        >
          <span className="material-symbols-outlined text-xs">filter_alt</span>
          <span>Filter Projects</span>
        </button>
      </div>

      {/* Filter Modal Overlay */}
      <ProjectFilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        events={events}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onReset={handleResetFilter}
      />

      {/* Main Content Sections */}
      <div className="flex flex-col gap-12 relative">
        {currentProjects.length === 0 && (
          <div className="w-full text-center text-xs font-mono text-[#83958d] py-12 border border-dashed border-white/5 rounded-sm">
            No projects matched or published yet.
          </div>
        )}

        {/* 1. GENERAL AWARDS SECTION */}
        {paginatedGeneral.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-l-2 border-[#00e0b3] pl-3">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-[#83958d]">
                RANKED_RECOGNITION: <span className="text-[#00e0b3]">GENERAL_AWARDS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedGeneral.map((project, index) => (
                  <AwardProjectCard
                    key={project.id}
                    project={project}
                    awardType={AWARD_TYPE.GENERAL}
                    index={index}
                    coverUrl={resolveCoverUrl(project)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 2. SPECIFIC AWARDS SECTION */}
        {paginatedSpecific.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-l-2 border-[#00e0b3] pl-3">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-[#83958d]">
                RANKED_RECOGNITION: <span className="text-[#00e0b3]">SPECIFIC_AWARDS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedSpecific.map((project, index) => (
                  <AwardProjectCard
                    key={project.id}
                    project={project}
                    awardType={AWARD_TYPE.SPECIFIC}
                    index={index}
                    coverUrl={resolveCoverUrl(project)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* 3. PARTICIPANTS SECTION */}
        {paginatedParticipants.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-l-2 border-[#00e0b3] pl-3">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-[#83958d]">
                REGISTRY_NODES: <span className="text-[#00e0b3]">PARTICIPANTS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedParticipants.map((project, index) => (
                  <ParticipantProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    coverUrl={resolveCoverUrl(project)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
