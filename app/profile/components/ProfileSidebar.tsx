/**
 * PURPOSE:
 * Renders the left sidebar of the edit user profile interface.
 * It contains the user avatar display with a hover-triggered instant file upload input,
 * watched live name/title displays, the public bio synopsis preview, and the Github/LinkedIn inputs.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of UserProfileClient.tsx, located at 'app/profile/components/ProfileSidebar.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - user (Profile, Required): The initial user profile data.
 * - register (UseFormRegister<ProfileInsert>, Required): react-hook-form register callback.
 * - errors (FieldErrors<ProfileInsert>, Required): react-hook-form validation errors.
 * - fullNamePreview (string, Required): Current form state value for full_name.
 * - jobTitlePreview (string, Required): Current form state value for job_title.
 * - companyNamePreview (string, Required): Current form state value for company_name.
 * - descriptionPreview (string, Required): Current form state value for description.
 */

'use client'

import { useState } from "react"
import Image from "next/image"
import { UseFormRegister, FieldErrors } from "react-hook-form"
import { createClient } from "@/app/utils/supabase/client"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { Profile, ProfileInsert } from "../../types/profile"
import { tw } from "@/app/constants/design-tokens"

interface ProfileSidebarProps {
  user: Profile
  register: UseFormRegister<ProfileInsert>
  errors: FieldErrors<ProfileInsert>
  fullNamePreview: string
  jobTitlePreview: string
  companyNamePreview: string
  descriptionPreview: string
}

export default function ProfileSidebar({
  user,
  register,
  errors,
  fullNamePreview,
  jobTitlePreview,
  companyNamePreview,
  descriptionPreview,
}: ProfileSidebarProps) {
  const supabase = createClient()
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  /**
   * BEHAVIORAL MECHANISM:
   * Generates public storage URL for the avatar path.
   *
   * PARAMETERS:
   * - imagePath (string): Path inside supabase attachments bucket.
   *
   * RETURNS:
   * - string: Public URL string.
   */
  const handleGetInitialImage = (imagePath: string): string => {
    const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath)
    return data.publicUrl
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.avatar_url ? handleGetInitialImage(user.avatar_url) : null
  )

  /**
   * BEHAVIORAL MECHANISM:
   * Intercepts file select, uploads file immediately via Supabase client,
   * updates local preview state, and triggers notification.
   *
   * PARAMETERS:
   * - e (React.ChangeEvent<HTMLInputElement>): Native file change event.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setIsOpenLoader(true)
      try {
        const avatarPath = `${user.id}/${Date.now()}-${file.name}`
        const { error: storageError } = await supabase.storage.from('attachments').upload(avatarPath, file)
        if (storageError) throw new Error("Failed to upload avatar image")

        if (user.avatar_url) {
          await supabase.storage.from('attachments').remove([user.avatar_url])
        }

        const { error } = await supabase.from('profiles').update({ avatar_url: avatarPath }).eq('id', user.id)
        if (error) throw new Error("Failed to update profile avatar")

        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        showNotification("Update image successfully")
      } catch (error) {
        if (error instanceof Error) {
          showNotification(error.message)
        }
      } finally {
        setIsOpenLoader(false)
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Photo & Description Card */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col items-center relative overflow-hidden select-none`}>
        {/* Decorative Top Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00e0b3]" />

        {/* Square Avatar Wrapper */}
        <div className="relative w-28 h-28 border border-[#00e0b3]/30 bg-[#151312] group overflow-hidden shrink-0 mt-2">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              fill
              sizes="112px"
              className="object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#151312] text-[#83958d] font-mono">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
              <span className="text-[7px] tracking-widest uppercase mt-1">
                {fullNamePreview ? fullNamePreview.slice(0, 2).toUpperCase() : "NODE"}
              </span>
            </div>
          )}

          {/* Hover Instant Photo upload Overlay */}
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-[#00e0b3] font-mono text-[8px] tracking-widest font-bold gap-1.5 z-10">
            <span className="material-symbols-outlined text-base">upload</span>
            <span>CHANGE PHOTO</span>
          </div>

          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-20"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Name and Professional Subtitle */}
        <h2 className="text-sm font-mono font-bold text-[#e8e1df] mt-4 uppercase tracking-wider text-center max-w-full truncate">
          {fullNamePreview || "UNMAPPED_NODE"}
        </h2>
        <span className="text-[9px] font-mono text-[#00e0b3] mt-0.5 uppercase tracking-widest text-center max-w-full truncate">
          {jobTitlePreview || "STUDENT_NODE"}
          {companyNamePreview ? ` @ ${companyNamePreview}` : ""}
        </span>

        {/* Public Bio Section */}
        <div className="w-full border-t border-white/5 pt-4 mt-4 flex flex-col gap-2">
          <label className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
            PUBLIC BIO
          </label>
          <textarea
            {...register("description")}
            placeholder="Write a brief synopsis about yourself..."
            rows={4}
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors resize-none leading-relaxed select-text"
          />
          {errors.description && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.description.message}
            </span>
          )}
        </div>
      </div>

      {/* Technical Links Card */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-4`}>
        <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
          TECHNICAL NODES
        </span>

        <div className="flex flex-col gap-3">
          {/* GitHub Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
              GITHUB PROFILE
            </label>
            <div className="relative flex items-center">
              <input
                {...register("github")}
                type="text"
                placeholder="github.com/username"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pl-9 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors"
              />
              <div className="absolute left-3 text-[#83958d] flex items-center justify-center pointer-events-none">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
            </div>
            {errors.github && (
              <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
                {errors.github.message}
              </span>
            )}
          </div>

          {/* LinkedIn Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
              LINKEDIN URL
            </label>
            <div className="relative flex items-center">
              <input
                {...register("linkedIn")}
                type="text"
                placeholder="linkedin.com/in/username"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pl-9 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors"
              />
              <div className="absolute left-3 text-[#83958d] flex items-center justify-center pointer-events-none">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
            </div>
            {errors.linkedIn && (
              <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
                {errors.linkedIn.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
