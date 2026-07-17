'use client'

import { motion } from "framer-motion"
import { tw } from "@/app/constants/design-tokens"

interface EventLocationProps {
  location: string | null | undefined
}

/**
 * PURPOSE:
 * Renders the Deployment Location panel for a single event detail page. It displays
 * the physical address or venue text from the event record's 'location' field.
 * Shows a fallback label when no location is specified.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/events/[id]/SingleEventClient.tsx' and placed in
 * 'app/events/[id]/components/EventLocation.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - location (string | null | undefined, Required): The event location text from the database record.
 */
export default function EventLocation({ location }: EventLocationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <span className="material-symbols-outlined text-sm text-[#00e0b3]">location_on</span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
          Deployment Location
        </span>
      </div>

      {/* Location Content */}
      <div className="p-6">
        <div>
          <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider block mb-1">
            Physical_Address
          </span>
          <p className={`${tw.text.onSurfaceVariant} text-sm leading-relaxed`}>
            {location ?? 'No location specified.'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
