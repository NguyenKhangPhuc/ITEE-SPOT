'use client'

import Image from "next/image"
import { motion } from "framer-motion"
import { UseFormRegister, FieldErrors, Control, useWatch } from "react-hook-form"
import { EditGroupInfo } from "@/app/types/group"
import { SHORT_DESCRIPTION_LENGTH } from "@/app/constants"
import { tw } from "@/app/constants/design-tokens"

interface GroupIdentitySectionProps {
  registerGroup: UseFormRegister<EditGroupInfo>
  groupErrors: FieldErrors<EditGroupInfo>
  control: Control<EditGroupInfo>
  previewUrl: string | null
  handleFileChange: (file: File) => void
  handleRemoveAvatarFile: () => void
  handleUpdateImage: () => void
}

/**
 * PURPOSE:
 * Renders the left-hand Identity Parameters panel for the single group detail page.
 * It contains the group name input, short description textarea (with a live character counter),
 * the group poster upload zone, and the "Commit Changes" action button.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/groups/[id]/SingleGroupClient.tsx' and placed in
 * 'app/groups/[id]/components/GroupIdentitySection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - registerGroup (UseFormRegister<EditGroupInfo>, Required): react-hook-form register function.
 * - groupErrors (FieldErrors<EditGroupInfo>, Required): Form validation error map.
 * - control (Control<EditGroupInfo>, Required): react-hook-form control for useWatch.
 * - previewUrl (string | null, Required): Object URL or Supabase URL for the poster preview.
 * - handleFileChange ((file: File) => void, Required): Callback when a new poster file is selected.
 * - handleRemoveAvatarFile (() => void, Required): Clears the selected poster file and preview.
 * - handleUpdateImage (() => void, Required): Saves the poster to Supabase storage.
 */
export default function GroupIdentitySection({
  registerGroup,
  groupErrors,
  control,
  previewUrl,
  handleFileChange,
  handleRemoveAvatarFile,
  handleUpdateImage,
}: GroupIdentitySectionProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Subscribes to the 'short_description' field via useWatch to drive a live character
   * counter. Isolated to this component so only the counter re-renders on keystroke,
   * not the entire page.
   *
   * PARAMETERS:
   * None — reads from context via control.
   *
   * RETURNS:
   * - string: The current textarea value.
   */
  const descriptionValue = useWatch({ control, name: "short_description", defaultValue: "" })
  const isOver = descriptionValue.length >= SHORT_DESCRIPTION_LENGTH

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sm text-[#00e0b3]">badge</span>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
            Identity_Parameters
          </span>
        </div>
        <span className="text-[9px] font-mono text-[#83958d]">
          EDIT_MODE
        </span>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Group Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
            Group_Name
          </label>
          <input
            placeholder="Cluster Identifier..."
            type="text"
            className={`w-full bg-[#151312] border ${
              groupErrors.groupName ? 'border-red-400/50' : 'border-white/10'
            } rounded-sm px-4 py-2.5 text-sm font-mono text-[#e8e1df] placeholder:text-[#83958d]/50 focus:outline-none focus:border-[#00e0b3]/50 transition-colors`}
            {...registerGroup('groupName', { required: "Group name is required" })}
          />
          {groupErrors.groupName && (
            <p className="text-red-400 text-[10px] font-mono">{groupErrors.groupName.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
            Group_Description
          </label>
          <textarea
            rows={4}
            maxLength={SHORT_DESCRIPTION_LENGTH}
            placeholder="Enter cluster mission parameters..."
            className={`w-full bg-[#151312] border ${
              groupErrors.short_description ? 'border-red-400/50' : 'border-white/10'
            } rounded-sm px-4 py-2.5 text-sm font-mono text-[#e8e1df] placeholder:text-[#83958d]/50 focus:outline-none focus:border-[#00e0b3]/50 transition-colors resize-none`}
            {...registerGroup('short_description', { required: "Short description is required" })}
          />
          {/* Live character counter */}
          <div className="flex justify-between items-center">
            {groupErrors.short_description && (
              <p className="text-red-400 text-[10px] font-mono">{groupErrors.short_description.message}</p>
            )}
            <span className={`text-[10px] font-mono ml-auto ${isOver ? 'text-red-400' : 'text-[#83958d]'}`}>
              {descriptionValue.length}/{SHORT_DESCRIPTION_LENGTH}
            </span>
          </div>
        </div>

        {/* Commit Changes Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 border border-[#00e0b3] bg-[#00e0b3]/10 hover:bg-[#00e0b3] hover:text-[#00382b] text-[#00e0b3] font-mono text-xs uppercase font-bold tracking-widest py-3 transition-all duration-300 rounded-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">save</span>
            Commit Changes
          </button>
        </div>

        {/* Poster Section */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
          <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
            Group_Poster
          </span>

          {previewUrl ? (
            <div className="relative w-full h-70 rounded-sm overflow-hidden border border-white/5 group">
              <Image
                src={previewUrl}
                alt="Group poster preview"
                fill
                sizes="600px"
                className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              />
              {/* Poster actions overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b1a]/80 to-transparent flex items-end justify-end gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleUpdateImage}
                  className="text-[9px] font-mono uppercase tracking-wider text-[#00e0b3] border border-[#00e0b3]/30 bg-[#00e0b3]/10 px-3 py-1 rounded-sm hover:bg-[#00e0b3]/20 transition-all cursor-pointer"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={handleRemoveAvatarFile}
                  className="text-[9px] font-mono uppercase tracking-wider text-[#83958d] border border-white/10 bg-white/5 px-3 py-1 rounded-sm hover:border-white/20 transition-all cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="w-full h-32 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#00e0b3]/30 transition-colors group">
              <span className="material-symbols-outlined text-2xl text-[#83958d] group-hover:text-[#00e0b3] transition-colors">
                add_photo_alternate
              </span>
              <span className="text-[10px] font-mono text-[#83958d] uppercase tracking-wider group-hover:text-[#00e0b3] transition-colors">
                Upload_Poster
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileChange(file)
                }}
              />
            </label>
          )}
        </div>
      </div>
    </motion.div>
  )
}
