'use client'

import { motion } from "framer-motion"
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor"
import { tw } from "@/app/constants/design-tokens"

interface EventOverviewProps {
  content: string | null | undefined
}

/**
 * PURPOSE:
 * Renders the Overview panel for a single event detail page. It displays the
 * rich-text HTML event content using the ReadOnlyEditor (TipTap), themed with the
 * dark terminal palette. If no content is provided, a fallback message is shown.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/events/[id]/SingleEventClient.tsx' and placed in
 * 'app/events/[id]/components/EventOverview.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - content (string | null | undefined, Required): The raw HTML string from the event record's
 *   'content' field, produced by a TipTap editor.
 */
export default function EventOverview({ content }: EventOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <span className="material-symbols-outlined text-sm text-[#00e0b3]">description</span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
          Overview
        </span>
      </div>

      {/* Rich-text Editor Content */}
      <div className="p-6 event-detail-editor">
        {content ? (
          <ReadOnlyEditor content={content} />
        ) : (
          <p className={`${tw.text.onSurfaceVariant} text-sm font-mono`}>
            No content provided.
          </p>
        )}
      </div>
    </motion.div>
  )
}
