'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { tw } from "@/app/constants/design-tokens"

interface GroupActionButtonsProps {
  groupId: string
  handleRemoveStudentSelf: () => Promise<void>
}

/**
 * PURPOSE:
 * Renders the primary action buttons for the group detail page, including access to
 * the submission portal and the self-exclusion protocol (allowing a student to leave
 * the group).
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/groups/[id]/SingleGroupClient.tsx' and placed in
 * 'app/groups/[id]/components/GroupActionButtons.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): The database ID of the current group.
 * - handleRemoveStudentSelf (() => Promise<void>, Required): Callback to trigger the self-exclusion logic.
 */
export default function GroupActionButtons({
  groupId,
  handleRemoveStudentSelf,
}: GroupActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="flex flex-col gap-4"
    >
      {/* Access Submission Portal */}
      <Link
        href={`/submission/${groupId}`}
        className="w-full flex items-center justify-center gap-3 border border-[#00e0b3] bg-transparent hover:bg-[#00e0b3]/5 text-[#00e0b3] font-mono text-xs uppercase font-bold tracking-widest py-3.5 transition-all duration-300 rounded-sm"
      >
        <span className="material-symbols-outlined text-sm">rocket_launch</span>
        <span>Access Submission Portal</span>
      </Link>

      {/* Self-Exclusion Protocol */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleRemoveStudentSelf}
          className="w-full flex items-center justify-center gap-3 border border-red-500/40 bg-transparent hover:bg-red-500/5 text-red-400 font-mono text-xs uppercase font-bold tracking-widest py-3.5 transition-all duration-300 rounded-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">warning</span>
          <span>Self-Exclusion Protocol</span>
        </button>

        {/* Warning Note */}
        <p className="text-[8px] font-mono text-[#83958d] text-center uppercase tracking-wider">
          Warning: Irreversible disconnect from local cluster.
        </p>
      </div>
    </motion.div>
  )
}
