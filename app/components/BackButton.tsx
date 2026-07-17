'use client'

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { tw } from "../constants/design-tokens"

/**
 * PURPOSE:
 * A reusable navigation button that allows users to return to the previous page
 * in their browser history using the Next.js router.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/components/BackButton.tsx' to be shared across pages (e.g. Events, Projects, Profiles).
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default function BackButton() {
  const router = useRouter()

  /**
   * BEHAVIORAL MECHANISM:
   * Utilizes the Next.js navigation router to trigger a browser-level backward history traversal.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - void
   */
  const handleBack = () => {
    router.back()
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      onClick={handleBack}
      className="cursor-pointer duration-300 inline-flex items-center gap-2 text-xs font-mono text-[#83958d] hover:text-[#00e0b3] transition-colors mb-6 group select-none"
    >
      <span className="material-symbols-outlined text-xs group-hover:-translate-x-1 transition-transform duration-300">
        arrow_back
      </span>
      <span>BACK</span>
    </motion.button>
  )
}
