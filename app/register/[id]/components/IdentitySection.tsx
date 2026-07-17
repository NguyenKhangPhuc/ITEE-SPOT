'use client'

import { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import { User } from "@supabase/supabase-js"
import WordCounter from "@/app/components/WordCounter"
import { SHORT_DESCRIPTION_LENGTH } from "@/app/constants"
import { tw } from "@/app/constants/design-tokens"
import { RegisterGroupMember } from "@/app/types/group_member"

interface IdentitySectionProps {
  register: UseFormRegister<RegisterGroupMember>
  errors: FieldErrors<RegisterGroupMember>
  control: Control<RegisterGroupMember>
  user: User
  otherMembers: number[]
}

/**
 * PURPOSE:
 * Renders the Identity Parameters section of the group registration form. It includes
 * the group name input, the short description textarea (with an isolated character counter),
 * and the member email array (one disabled field for the current user plus N-1 editable fields).
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/register/[id]/RegisterClient.tsx' and placed in
 * 'app/register/[id]/components/IdentitySection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<RegisterForm>, Required): react-hook-form register function.
 * - errors (FieldErrors<RegisterForm>, Required): Form validation error map.
 * - control (Control<RegisterForm>, Required): react-hook-form control, forwarded to WordCounter.
 * - user (User, Required): The authenticated Supabase user, used to pre-fill member slot 1.
 * - otherMembers (number[], Required): Array of slot indices for the remaining member inputs.
 */
export default function IdentitySection({
  register,
  errors,
  control,
  user,
  otherMembers,
}: IdentitySectionProps) {
  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <span className="material-symbols-outlined text-sm text-[#00e0b3]">badge</span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
          Identity_Parameters
        </span>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Group Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
            Group_Name [NODE_ID]
          </label>
          <input
            autoComplete="off"
            placeholder="Enter Cluster Identifier..."
            id="Title"
            type="text"
            className={`w-full bg-[#151312] border ${errors.title ? 'border-red-400/50' : 'border-white/10'} rounded-sm px-4 py-2.5 text-sm font-mono text-[#e8e1df] placeholder:text-[#83958d]/50 focus:outline-none focus:border-[#00e0b3]/50 transition-colors`}
            {...register('title', { required: "Group name is required" })}
          />
          {errors.title && (
            <p className="text-red-400 text-[10px] font-mono mt-0.5">{errors.title.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
            Group_Description [Synopsis]
          </label>
          <textarea
            placeholder="Enter Small cluster mission parameters..."
            rows={4}
            maxLength={SHORT_DESCRIPTION_LENGTH}
            className={`w-full bg-[#151312] border ${errors.short_description ? 'border-red-400/50' : 'border-white/10'} rounded-sm px-4 py-2.5 text-sm font-mono text-[#e8e1df] placeholder:text-[#83958d]/50 focus:outline-none focus:border-[#00e0b3]/50 transition-colors resize-none`}
            {...register('short_description', {
              maxLength: {
                value: SHORT_DESCRIPTION_LENGTH,
                message: `Maximum ${SHORT_DESCRIPTION_LENGTH} characters`,
              },
               required: "Group description is required"
            })}
          />
          {/* Isolated character counter — only this re-renders on typing */}
          <WordCounter control={control} fieldName="short_description" limit={SHORT_DESCRIPTION_LENGTH} />
          {errors.short_description && (
            <p className="text-red-400 text-[10px] font-mono ">{errors.short_description.message}</p>
          )}
        </div>

        {/* Member Array */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
              Member_Array [{otherMembers.length + 1}_Units_Default]
            </span>
            <span className="text-[9px] font-mono text-[#00e0b3]">
              Capacity: {otherMembers.length + 1}_Units
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Slot 01 — current user, disabled */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#151312]/60 border border-white/5 rounded-sm">
              <span className="text-[9px] font-mono text-[#83958d] w-5 shrink-0">01.</span>
              <span className="text-[10px] font-mono text-[#83958d] flex-grow truncate">
                {user?.email ?? 'CONTRIBUTOR_NODE_EMAIL'}
              </span>
              <span className="material-symbols-outlined text-[10px] text-[#00e0b3] shrink-0">
                verified
              </span>
            </div>

            {/* Remaining member slots */}
            {otherMembers.map((num, index) => (
              <div key={`member-${num}`} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-[#83958d] w-5 shrink-0">
                    {String(num).padStart(2, '0')}.
                  </span>
                  <input
                    autoComplete="off"
                    placeholder={`CONTRIBUTOR_NODE_EMAIL_${String(num).padStart(2, '0')}`}
                    type="email"
                    className={`flex-grow bg-[#151312] border ${
                      errors.member_emails?.[index + 1] ? 'border-red-400/50' : 'border-white/10'
                    } rounded-sm px-3 py-2 text-[11px] font-mono text-[#e8e1df] placeholder:text-[#83958d]/40 focus:outline-none focus:border-[#00e0b3]/50 transition-colors`}
                    {...register(`member_emails.${index + 1}`, {
                      setValueAs: (v: string) => (v.trim() === "" ? null : v.toLowerCase().trim()),
                      validate: (value, formValues) => {
                        const isDuplicate = formValues.member_emails.find(
                          (email: string | null, idx: number) =>
                            email === value && idx !== index + 1 && email != null
                        )
                        if (isDuplicate) return "Duplicated email"
                        return true
                      },
                    })}
                  />
                </div>
                {errors.member_emails?.[index + 1]?.message && (
                  <p className="text-red-400 text-[10px] font-mono pl-8">
                    {errors.member_emails[index + 1]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
