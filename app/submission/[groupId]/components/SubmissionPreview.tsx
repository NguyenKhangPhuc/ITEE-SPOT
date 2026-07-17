'use client'

import { useWatch, Control } from "react-hook-form"
import { SubmissionInsert } from "@/app/types/submission"
import { tw } from "@/app/constants/design-tokens"

interface SubmissionPreviewProps {
  control: Control<SubmissionInsert>
}

/**
 * PURPOSE:
 * Renders the live project preview card shown next to the Rich Description editor.
 * It uses useWatch to read the current project title and tagline (short_description)
 * without triggering re-renders in the parent form or editor.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/submission/[groupId]/components/SubmissionPreview.tsx' to optimize rendering
 * performance during form inputs.
 *
 * INPUTS / PARAMETERS:
 * - control (Control<SubmissionInsert>, Required): react-hook-form control object to bind useWatch.
 */
export default function SubmissionPreview({ control }: { control: Control<SubmissionInsert> }) {
  const title = useWatch({ name: "title", control, defaultValue: "" })
  const shortDescription = useWatch({ name: "short_description", control, defaultValue: "" })

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#151312]/60 border border-white/5 rounded-sm h-full justify-between">
      <div className="flex flex-col gap-2">
        {/* Project Title Live Preview */}
        <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider block">
          Live_Payload_Preview
        </span>
        <h4 className="text-sm font-mono font-bold text-[#00e0b3] uppercase truncate">
          {title?.trim() ? title : "Node_Untitled"}
        </h4>

        {/* Project Tagline Live Preview */}
        <p className={`${tw.text.onSurfaceVariant} text-xs leading-relaxed opacity-75 min-h-[48px] line-clamp-6`}>
          {shortDescription?.trim() ? shortDescription : "Awaiting cluster synopsis description parameters..."}
        </p>
      </div>

      {/* Decorative Network Stats */}
      <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-[#83958d]">
          <span>Node_Latency</span>
          <span className="text-[#00e0b3]">12ms</span>
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-[#83958d]">
          <span>Expansion_Vectors</span>
          <span className="text-[#e8e1df] truncate max-w-[120px]">Edu, Tech, Comm</span>
        </div>
      </div>
    </div>
  )
}
