'use client'

import { motion } from "framer-motion"
import { tw } from "@/app/constants/design-tokens"

interface ReadOnlySubmissionHeaderProps {
  breadcrumbs: string[]
  title: string
  tagline: string
  groupName: string
  createdAt: string
}

/**
 * PURPOSE:
 * Renders the top header block for the read-only project submission viewer. It displays breadcrumbs,
 * a verified status badge, the node (group) name, and submission timestamp.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/submission/[groupId]/read-only/components/ReadOnlySubmissionHeader.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - breadcrumbs (string[], Required): Array of page path nodes.
 * - title (string, Required): Project name.
 * - tagline (string, Required): Short synopsis/description.
 * - groupName (string, Required): The group/team node name.
 * - createdAt (string, Required): Submission timestamp.
 */
export default function ReadOnlySubmissionHeader({
  breadcrumbs,
  title,
  tagline,
  groupName,
  createdAt,
}: ReadOnlySubmissionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
    >
      {/* Left side: Breadcrumbs & Title */}
      <div className="flex flex-col gap-2">
        {/* Breadcrumb list */}
        <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-[#83958d] uppercase tracking-wider">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-[#83958d]/55">&gt;</span>}
              <span className={idx === breadcrumbs.length - 1 ? "text-[#00e0b3] font-semibold" : ""}>
                {crumb}
              </span>
            </div>
          ))}
        </div>

        {/* Project Title */}
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight mt-1">
          Project_Data: <span className="text-[#00e0b3]">{title}</span>
        </h1>

        {/* Tagline */}
        <p className={`${tw.text.onSurfaceVariant} text-sm mt-1 max-w-2xl leading-relaxed opacity-85`}>
          {tagline}
        </p>
      </div>

      {/* Right side: Verification Status & Metadata */}
      <div className="flex flex-col gap-2 bg-[#151312]/60 border border-white/5 rounded-sm p-4 min-w-[240px] shrink-0 font-mono text-[9px] uppercase tracking-widest text-[#83958d]">
        <div className="flex justify-between items-center">
          <span>Status</span>
          <span className="px-2 py-0.5 border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm font-bold text-[8px] animate-pulse">
            VERIFIED
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span>Node</span>
          <span className="text-[#e8e1df] font-semibold">{groupName}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span>Timestamp</span>
          <span className="text-[#e8e1df] font-semibold">
            {createdAt ? new Date(createdAt).toLocaleString('fi-FI', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : 'N/A'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
