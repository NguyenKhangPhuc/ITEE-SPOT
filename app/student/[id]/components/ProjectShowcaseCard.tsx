/**
 * PURPOSE:
 * Renders a styled, responsive vertical card representing a project showcase entry.
 * It features a cover image with an event badge overlay, title, team identifier,
 * and a bottom row displaying the verification status and a navigation link.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component to ProfileHeader.tsx. Mounted as a grid item inside
 * the StudentProfileClient.tsx contributions grid.
 *
 * INPUTS / PARAMETERS:
 * - project (ProjectsSummaryExtended, Required): The project summary object.
 * - index (number, Required): The animation delay factor.
 */

'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/app/utils/supabase/client"
import { handleGetUrl } from "@/app/helpers/FileUrl"
import { ProjectsSummaryExtended } from "@/app/types/projects"
import { tw } from "@/app/constants/design-tokens"

interface ProjectShowcaseCardProps {
  project: ProjectsSummaryExtended
  index: number
}

export default function ProjectShowcaseCard({ project, index }: ProjectShowcaseCardProps) {
  const supabase = createClient()

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves the project cover image URL by checking group poster path first,
   * then falling back to event poster path.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - string | null: Storage public URL or null if missing.
   */
  const resolveCoverUrl = (): string | null => {
    const path = project.groups?.poster_path || project.groups?.events?.poster_path
    if (path) {
      return handleGetUrl(supabase, path)
    }
    return null
  }

  const coverUrl = resolveCoverUrl()
  const eventName = project.groups?.events?.title || "UNMAPPED_EVENT"

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#00e0b3]/20 transition-all duration-300 group h-full`}
      >
        {/* Banner area */}
        <div className="w-full h-44 relative bg-[#151312] border-b border-white/5 overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={project.project_title || "Project Banner"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,224,179,0.02)_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
          )}

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Event Overlay Tag */}
          <span className="absolute top-4 left-4 px-2 py-0.5 border border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3] rounded-sm font-mono text-[7px] font-bold uppercase tracking-widest z-10 max-w-[80%] truncate">
            {eventName.toUpperCase().replace(/\s+/g, "_")}
          </span>
        </div>

        {/* Content details */}
        <div className="p-5 flex flex-col gap-3 flex-grow">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-mono font-bold text-[#e8e1df] uppercase tracking-wider group-hover:text-[#00e0b3] transition-colors truncate">
              {project.project_title || "UNTITLED_PROJECT"}
            </h3>
            <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider">
              Team: {project.groups?.group_name || "UNNAMED_TEAM"}
            </span>
          </div>

          <p className="text-xs font-mono text-[#b9cbc2] line-clamp-3 leading-relaxed mt-1 flex-grow">
            {project.short_description || "No project parameters or synopsis mapped to this node."}
          </p>

          {/* Status and Action footer */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2 text-[8px] font-mono tracking-widest uppercase font-bold text-[#83958d] select-none">
            <span>
              STATUS:{" "}
              <span className={project.project_status === "accepted" ? "text-[#00e0b3]" : "text-[#83958d]"}>
                {project.project_status === "accepted"
                  ? "DEPLOYED"
                  : project.project_status === "pending"
                  ? "PENDING"
                  : "ARCHIVE"}
              </span>
            </span>

            <span className="material-symbols-outlined text-sm text-[#83958d] group-hover:text-[#00e0b3] group-hover:translate-x-1 transition-all duration-300">
              arrow_right_alt
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
