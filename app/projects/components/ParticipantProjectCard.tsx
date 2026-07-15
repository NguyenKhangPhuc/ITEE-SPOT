/**
 * PURPOSE:
 * Renders a project card for participants without general/specific awards. Shows a more compact,
 * horizontal layout with an inline core registry list.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/projects/ProjectsClient.tsx' to simplify the main archive code.
 *
 * INPUTS / PARAMETERS:
 * - project (ProjectsSummaryExtended, Required): The project summary data.
 * - index (number, Required): The position of the card in the list, used for delay animations.
 * - coverUrl (string | null, Required): Resolved URL for the cover image.
 */

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectsSummaryExtended } from '../../types/projects'
import { tw } from '@/app/constants/design-tokens'

interface ParticipantProjectCardProps {
  project: ProjectsSummaryExtended
  index: number
  coverUrl: string | null
}

export default function ParticipantProjectCard({
  project,
  index,
  coverUrl,
}: ParticipantProjectCardProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * The component renders a compact horizontal layout. It handles fade-in entry animation
   * staggered by index, resolves and displays the group thumbnail image (or falling back to a grid background),
   * lists up to three team members with their emails, and displays a link to open the data stream.
   *
   * PARAMETERS:
   * - project (ProjectsSummaryExtended): The project summary data.
   * - index (number): The animation layout delay factor.
   * - coverUrl (string | null): Resolved URL for the project/group poster image.
   *
   * RETURNS:
   * - React.JSX.Element: A rendered participant project card.
   */
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-4 flex gap-4 items-start hover:border-[#00e0b3]/20 transition-all duration-300 group relative`}
    >
      {/* Left square cover image */}
      <div className="w-24 h-24 relative bg-[#151312] border border-white/5 overflow-hidden shrink-0">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={project.project_title || 'Project Thumbnail'}
            fill
            sizes="96px"
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,224,179,0.02)_1px,transparent_1px)] [background-size:8px_8px] opacity-60" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
      </div>

      {/* Content block */}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex flex-col">
          <h3 className="text-xs font-mono font-bold text-[#00e0b3] uppercase tracking-wider truncate">
            {project.project_title || 'UNTITLED_PROJECT'}
          </h3>
          <span className="text-[7px] font-mono text-[#83958d] uppercase tracking-widest truncate">
            {project.groups?.events?.title || 'UNKNOWN'} · TEAM: {project.groups?.group_name || 'UNKNOWN'}
          </span>
        </div>

        {/* Inline Core Registry list */}
        <div className="flex flex-col gap-0.5 font-mono text-[7px] tracking-wider text-[#b9cbc2]">
          {(project.groups?.group_members ?? []).slice(0, 3).map((m, idx) => (
            <div key={idx} className="flex justify-between items-center pr-2">
              <span className="truncate max-w-[120px]">{m.profiles?.full_name}</span>
              <span className="text-[#83958d] truncate max-w-[120px]">{m.profiles?.email || 'itee.node'}</span>
            </div>
          ))}
        </div>

        {/* Action Link Text */}
        <Link
          href={`/projects/${project.id}`}
          className="text-[#00e0b3] hover:text-white font-mono text-[8px] font-bold uppercase tracking-widest inline-flex items-center gap-1 mt-1 cursor-pointer w-fit"
        >
          <span>[EXE] OPEN_DATA_STREAM</span>
          <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span>
        </Link>
      </div>
    </motion.div>
  )
}
