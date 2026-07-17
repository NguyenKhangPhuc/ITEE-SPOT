/**
 * PURPOSE:
 * Renders the Identity Core section of the edit user profile interface (01_IDENTITY_CORE).
 * It includes text fields for Full Name and a disabled/read-only Email Address.
 *
 * CONTEXT/PARENT FILE:
 * Subcomponent of UserProfileClient.tsx, located at 'app/profile/components/IdentityCoreSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - user (Profile, Required): The user database profile row containing the initial email.
 * - register (UseFormRegister<ProfileInsert>, Required): react-hook-form register callback.
 * - errors (FieldErrors<ProfileInsert>, Required): react-hook-form validation errors.
 */

'use client'

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { Profile, ProfileInsert } from "../../types/profile"
import { tw } from "@/app/constants/design-tokens"

interface IdentityCoreSectionProps {
  user: Profile
  register: UseFormRegister<ProfileInsert>
  errors: FieldErrors<ProfileInsert>
}

export default function IdentityCoreSection({
  user,
  register,
  errors,
}: IdentityCoreSectionProps) {
  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5 relative overflow-hidden select-none`}>
      
      {/* Section Header with tag */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm text-[#00e0b3]">account_circle</span>
          <span>01_IDENTITY_CORE</span>
        </div>
        <span className="px-2 py-0.5 border border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3] rounded-sm font-mono text-[7px] font-bold uppercase tracking-widest">
          CORE DATA
        </span>
      </div>

      {/* Grid Inputs row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 select-text">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            FULL NAME
          </label>
          <input
            {...register("full_name")}
            type="text"
            placeholder="John Doe"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm w-full outline-none focus:border-[#00e0b3]/50 transition-colors"
          />
          {errors.full_name && (
            <span className="text-[8px] font-mono text-red-400 uppercase mt-0.5">
              {errors.full_name.message}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[8px] font-mono text-[#b9cbc2] uppercase tracking-wider">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            disabled
            value={user.email ?? ""}
            className="bg-[#151312] text-[#83958d] border border-white/5 font-mono text-xs p-3 rounded-sm w-full outline-none cursor-not-allowed select-none"
          />
          <span className="text-[7px] font-mono text-[#83958d] uppercase tracking-wider mt-0.5 flex items-center gap-1 select-none">
            <span className="material-symbols-outlined text-[9px]">lock</span>
            Read-only system identifier
          </span>
        </div>
      </div>
    </div>
  )
}
