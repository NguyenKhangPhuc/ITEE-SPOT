/**
 * PURPOSE:
 * Renders a project card featured with either General or Specific Awards styling.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/projects/ProjectsClient.tsx' to isolate and reuse the award project card UI.
 *
 * INPUTS / PARAMETERS:
 * - project (ProjectsSummaryExtended, Required): The project summary data.
 * - awardType (AWARD_TYPE, Required): The type of award to match (GENERAL or SPECIFIC).
 * - index (number, Required): The position of the card in the list, used for delay animations.
 * - coverUrl (string | null, Required): Resolved URL for the cover image.
 */

'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectsSummaryExtended } from '../../types/projects'
import { AWARD_TYPE } from '../../types/enum'
import { tw } from '@/app/constants/design-tokens'

interface AwardProjectCardProps {
  project: ProjectsSummaryExtended
  awardType: AWARD_TYPE
  index: number
  coverUrl: string | null
}

export default function AwardProjectCard({
  project,
  awardType,
  index,
  coverUrl,
}: AwardProjectCardProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * The component renders a motion.div wrapper with entry animation based on the index.
   * It finds the primary award matching the specified awardType, displays the cover image or fallback grid,
   * lists team members from the project registry, and links to the full project page.
   *
   * PARAMETERS:
   * - project (ProjectsSummaryExtended): The project summary data.
   * - awardType (AWARD_TYPE): The type of award (e.g. GENERAL or SPECIFIC).
   * - index (number): The animation layout delay factor.
   * - coverUrl (string | null): The resolved Supabase bucket image URL or null.
   *
   * RETURNS:
   * - React.JSX.Element: A rendered award project card component.
   */
  const primaryAward = project.project_awards.find(
    (a) => a.event_awards?.award_type === awardType
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#00e0b3]/20 transition-all duration-300 group`}
    >
      {/* Image cover banner with award overlay */}
      <div className="w-full h-48 relative bg-[#151312] border-b border-white/5 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={project.project_title || 'Project Poster'}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,224,179,0.02)_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        {primaryAward?.event_awards?.award_title && (
          <span className="absolute top-4 left-4 px-2 py-0.5 bg-[#00e0b3] text-[#00382b] rounded-sm font-mono text-[7px] font-bold uppercase tracking-widest z-10">
            {primaryAward.event_awards.award_title}
          </span>
        )}
      </div>

      {/* Content block */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-mono font-bold text-[#00e0b3] uppercase tracking-wider group-hover:text-white transition-colors truncate">
            {project.project_title || 'UNTITLED_PROJECT'}
          </h3>
          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
            EVENT: {project.groups?.events?.title || 'UNKNOWN'} · TEAM: {project.groups?.group_name || 'UNKNOWN'}
          </span>
        </div>

        {/* Core Registry Box */}
        <div className="bg-[#151312] border border-white/5 rounded-sm p-4 flex flex-col gap-2 font-mono text-[8px] tracking-wider">
          <span className="text-[#00e0b3] font-bold uppercase">CORE REGISTRY:</span>
          <div className="flex flex-col gap-1.5 h-[80px] overflow-y-auto">
            {(project.groups?.group_members ?? []).map((m, idx) => (
              <div key={idx} className="flex justify-between items-center text-[#e8e1df]">
                <span className="font-semibold truncate pr-2">{m.profiles?.full_name}</span>
                <span className="text-[#83958d] shrink-0 truncate">{m.profiles?.email || 'itee.node'}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs font-mono text-[#83958d] line-clamp-2 leading-relaxed min-h-[40px]">
          {project.short_description ||
            project.groups?.short_description ||
            'No project parameters or synopsis mapped to this node.'}
        </p>

        <Link
          href={`/projects/${project.id}`}
          className="w-full flex items-center justify-center gap-2 border border-white/10 bg-[#151312] hover:bg-[#00e0b3]/5 hover:border-[#00e0b3]/40 text-[#e8e1df] hover:text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest py-3 transition-all duration-300 rounded-sm cursor-pointer mt-2"
        >
          <span>VIEW_PROJECT_DATA</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
        </Link>
      </div>
    </motion.div>
  )
}
