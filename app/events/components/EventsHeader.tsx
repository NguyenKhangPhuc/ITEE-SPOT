'use client'

import { tw } from "@/app/constants/design-tokens"
import { motion } from "framer-motion"

/**
 * PURPOSE:
 * This component renders the top header banner for the events listing page.
 * It features the technical status line, the main UPCOMING_EVENTS title, a short module
 * description, and a background decorative network hub icon.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'EventsClient.tsx' and placed in 'app/events/components/EventsHeader.tsx'
 * to separate the layout header structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default function EventsHeader() {
  return (
    <div className="max-w-7xl mx-auto mb-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border p-8 md:p-10 relative overflow-hidden rounded-sm`}
      >
        {/* Decorative Background Tech Icon */}
        <span className="material-symbols-outlined text-[100px] text-[#00e0b3]/10 absolute right-8 top-1/2 -translate-y-1/2 hidden sm:block">
          hub
        </span>

        <div className="relative z-10 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00e0b3] animate-pulse"></span>
            <span className={`${tw.text.mint} font-semibold text-[10px] uppercase tracking-[0.25em] font-mono`}>
              Status: Active_Retrieval
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 select-none">
            UPCOMING_EVENTS
          </h1>
          <p className={`${tw.text.onSurfaceVariant} text-sm md:text-base max-w-2xl leading-relaxed opacity-80`}>
            Accessing technical repositories, hackathons, and innovation workshops within the ITEE ecosystem. Filter your target coordinates below.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
