/**
 * PURPOSE:
 * Client Component that renders the details of a single student showcase project.
 * It features a dark terminal-themed layout containing event context, a dynamic telemetry box,
 * a YouTube demonstration showcase, resource downloads, and contributor profiles.
 * It delegates rendering of child subcomponents (telemetry terminal, resources card, event context,
 * YouTube video, and contributors) to modular components.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/projects/[id]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - project (SingleProject, Required): The full project detail object containing files, awards, group, and event parameters.
 */

'use client'

import { EVENT_STATUS, AWARD_TYPE } from "@/app/types/enum"
import { SingleProject } from "@/app/types/projects"
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor"
import BackButton from "@/app/components/BackButton"
import { tw } from "@/app/constants/design-tokens"
import { motion } from "framer-motion"

import ProjectYoutubeVideo from "./components/ProjectYoutubeVideo"
import ProjectTelemetryTerminal from "./components/ProjectTelemetryTerminal"
import EventContextCard from "./components/EventContextCard"
import ProjectResourcesCard from "./components/ProjectResourcesCard"
import ProjectContributors from "./components/ProjectContributors"

export default function SingleProjectClient({ project }: { project: SingleProject }) {
  /**
   * BEHAVIORAL MECHANISM:
   * Extracts the YouTube video ID from the project's video link and returns a standard embed URL.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - string | null: Embed URL or null if invalid/unsupported.
   */
  const handleGetEmbeddedUrl = (): string | null => {
    try {
      const urlObj = new URL(project.youtube_link ?? "")
      let videoId = ""

      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v")!
      } else if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1)
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    } catch (e) {
      return null
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 min-h-screen">
      {/* Back button */}
      <BackButton />

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8 mb-4"
      >
        <div className="flex flex-col gap-2">
          <span className="text-[#00e0b3] font-mono text-xs uppercase tracking-widest font-bold">
            TEAM: {project.groups?.group_name}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
            {project.project_title}
          </h1>
          {/* Awards Badges */}
          {project.project_awards && project.project_awards.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {project.project_awards.map((award) => {
                const isGeneral = award.event_awards?.award_type === AWARD_TYPE.GENERAL
                const badgeClass = isGeneral
                  ? "border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3]"
                  : "border border-[#83958d]/30 bg-[#83958d]/10 text-[#83958d]"

                return (
                  <span
                    key={award.id}
                    className={`px-2 py-0.5 rounded-sm font-bold text-[8px] uppercase tracking-widest flex items-center gap-1.5 ${badgeClass}`}
                  >
                    <span className="material-symbols-outlined text-[10px]">emoji_events</span>
                    {award.event_awards?.award_title?.toUpperCase().replace(" ", "_")}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Registry Status */}
        <div className="flex flex-col md:items-end font-mono select-none">
          <span className="text-[9px] text-[#83958d] uppercase tracking-widest">
            REGISTRY STATUS
          </span>
          <span className="text-sm font-extrabold text-[#00e0b3] tracking-widest mt-1">
            VERIFIED // ARCHIVED
          </span>
        </div>
      </motion.div>

      {/* Main Two-Column Layout */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Video Demonstration & Descriptions */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Demonstration Section */}
          <div className="flex flex-col">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3] flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-sm">play_circle</span>
              <span>System Demonstration</span>
            </h2>
            <ProjectYoutubeVideo
              embeddedUrl={handleGetEmbeddedUrl()}
              title={project.project_title ?? "Showcase"}
            />
          </div>

          {/* Architecture Section */}
          <div className="flex flex-col">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#e8e1df] flex items-center gap-2 mb-4">
              <span>System Architecture</span>
            </h2>

            {/* Dynamic Telemetry Box */}
            <ProjectTelemetryTerminal
              projectTitle={project.project_title ?? null}
              groupName={project.groups?.group_name ?? null}
              memberCount={project.groups?.group_members?.length || 0}
            />

            {/* Short Description */}
            <p className="text-xs font-mono text-[#b9cbc2] leading-relaxed mb-6 italic">
              {project.short_description}
            </p>

            {/* Rich Editor Block */}
            <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 md:p-8`}>
              <div className="event-detail-editor">
                <ReadOnlyEditor content={project.description || ""} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Event Context & Resources Sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Event Context Card */}
          <EventContextCard
            event={project.groups?.events ?? null}
            projectId={project.id ?? ""}
          />

          {/* Project Resources Card */}
          <ProjectResourcesCard
            githubLink={project.github_link ?? 'https://github.com'}
            projectFiles={project.project_files}
          />

          {/* Contributor / Meet the Team Section */}
          <ProjectContributors members={project.groups?.group_members ?? null} />
        </div>
      </motion.div>
    </div>
  )
}