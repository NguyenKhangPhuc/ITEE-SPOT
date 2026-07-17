'use client'

import { motion } from "framer-motion"
import { tw } from "@/app/constants/design-tokens"

/**
 * PURPOSE:
 * Renders the top header banner for the challenge submission dashboard. It specifies the
 * submission protocol version, the system action status, and a brief description of the
 * upload requirements.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/submission/[groupId]/components/SubmissionHeader.tsx' to modularize the
 * submission view header layout.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default function SubmissionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="inline-flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b3] animate-pulse" />
        <span className="text-[10px] font-mono text-[#00e0b3] uppercase tracking-[0.25em]">
          Protocol: V.04_Submit
        </span>
      </div>
      <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight">
        System_Submission: <span className="text-[#00e0b3]">Node_Uploader</span>
      </h1>
      <p className={`${tw.text.onSurfaceVariant} text-sm mt-2 max-w-2xl leading-relaxed opacity-80`}>
        Initialize multi-challenge upload interface. Ensure all linked data points are valid
        before final commit to the central node repository.
      </p>
    </motion.div>
  )
}
