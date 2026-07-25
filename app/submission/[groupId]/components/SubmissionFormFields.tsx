'use client'

import { UseFormRegister, FieldErrors, Control } from "react-hook-form"
import { SubmissionInsert } from "@/app/types/submission"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import WordCounter from "@/app/components/WordCounter"
import { SHORT_DESCRIPTION_LENGTH } from "@/app/constants"

interface SubmissionFormFieldsProps {
  register: UseFormRegister<SubmissionInsert>
  errors: FieldErrors<SubmissionInsert>
  control: Control
}

/**
 * PURPOSE:
 * Renders the basic information input grid for a challenge submission. It contains
 * input elements for Project Title, Project Tagline (short_description), GitHub Link,
 * and YouTube Link. The links are styled with custom icon-prepend slots matching
 * the dark console terminal mockup.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/submission/[groupId]/SubmissionClient.tsx' and placed in
 * 'app/submission/[groupId]/components/SubmissionFormFields.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<SubmissionInsert>, Required): react-hook-form register.
 * - errors (FieldErrors<SubmissionInsert>, Required): react-hook-form errors.
 * - control (Control<SubmissionInsert>, Required): react-hook-form control.
 */
export default function SubmissionFormFields({
  register,
  errors,
  control,
}: SubmissionFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 2x2 Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
            Submission_Parameter: Title
          </label>
          <input
            autoComplete="off"
            placeholder="Enter Project Name..."
            type="text"
            className={`w-full bg-[#151312] border ${errors.title ? 'border-red-400/50' : 'border-white/10'
              } rounded-sm px-4 py-2.5 text-xs font-mono text-[#e8e1df] placeholder:text-[#83958d]/30 focus:outline-none focus:border-[#00e0b3]/50 transition-colors`}
            {...register('title', { required: "Project title is required" })}
          />
          {errors.title && (
            <p className="text-red-400 text-[9px] font-mono mt-0.5">{errors.title.message}</p>
          )}
        </div>

        {/* Tagline / Short Description Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
            Submission_Parameter: Tagline
          </label>
          <input
            autoComplete="off"
            placeholder="One sentence summary..."
            type="text"
            maxLength={SHORT_DESCRIPTION_LENGTH}
            className={`w-full bg-[#151312] border ${errors.short_description ? 'border-red-400/50' : 'border-white/10'
              } rounded-sm px-4 py-2.5 text-xs font-mono text-[#e8e1df] placeholder:text-[#83958d]/30 focus:outline-none focus:border-[#00e0b3]/50 transition-colors`}
            {...register('short_description', {
              required: "Tagline is required",
              maxLength: {
                value: SHORT_DESCRIPTION_LENGTH,
                message: `Maximum ${SHORT_DESCRIPTION_LENGTH} characters`,
              }
            })}
          />
          <WordCounter control={control} fieldName="short_description" limit={SHORT_DESCRIPTION_LENGTH} />
          {errors.short_description && (
            <p className="text-red-400 text-[9px] font-mono mt-0.5">{errors.short_description.message}</p>
          )}
        </div>

        {/* GitHub Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
            Data_Link: GitHub
          </label>
          <div className={`flex bg-[#151312] border ${errors.github_link ? 'border-red-400/50' : 'border-white/10'
            } rounded-sm overflow-hidden focus-within:border-[#00e0b3]/50 transition-colors`}>
            <div className="flex items-center justify-center bg-[#1d1b1a] border-r border-white/5 px-3 shrink-0 text-[#83958d]">
              <span className="material-symbols-outlined text-xs">code</span>
            </div>
            <input
              autoComplete="off"
              placeholder="https://github.com/..."
              type="text"
              className="w-full bg-transparent px-3 py-2 text-xs font-mono text-[#e8e1df] placeholder:text-[#83958d]/30 focus:outline-none"
              {...register('github_link', { required: "GitHub link is required" })}
            />
          </div>
          {errors.github_link && (
            <p className="text-red-400 text-[9px] font-mono mt-0.5">{errors.github_link.message}</p>
          )}
        </div>

        {/* YouTube Link */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest block">
            Data_Link: YouTube
          </label>
          <div className="flex bg-[#151312] border border-white/10 rounded-sm overflow-hidden focus-within:border-[#00e0b3]/50 transition-colors">
            <div className="flex items-center justify-center bg-[#1d1b1a] border-r border-white/5 px-3 shrink-0 text-[#83958d]">
              <span className="material-symbols-outlined text-xs">play_circle</span>
            </div>
            <input
              autoComplete="off"
              placeholder="https://youtube.com/..."
              type="text"
              className="w-full bg-transparent px-3 py-2 text-xs font-mono text-[#e8e1df] placeholder:text-[#83958d]/30 focus:outline-none"
              {...register('youtube_link')}
            />
          </div>
        </div>
      </div>

      {/* Embedded video preview if link is valid */}
      <YoutubeVideo control={control} />
    </div>
  )
}
