/**
 * PURPOSE:
 * Renders the Core Identity form section for the Event Creation panel.
 * Contains input controls for Event Title, Max Members count, and Location Node.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of CreateEventClient.tsx, located at 'app/events/create/components/CoreIdentitySection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<EventInsert>, Required): react-hook-form register callback.
 * - errors (FieldErrors<EventInsert>, Required): react-hook-form errors validation map.
 */

'use client'

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { EventInsert } from "@/app/types/event"
import { tw } from "@/app/constants/design-tokens"

interface CoreIdentitySectionProps {
  register: UseFormRegister<EventInsert>
  errors: FieldErrors<EventInsert>
}

export default function CoreIdentitySection({ register, errors }: CoreIdentitySectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-white/5">
      {/* Section description side */}
      <div className="lg:col-span-4 flex gap-3 select-none">
        <div className="w-[2px] h-4 bg-[#00e0b3] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
            CORE_IDENTITY
          </h2>
          <p className="text-[9.5px] font-mono text-[#83958d] leading-relaxed">
            Define the primary identifiers for the upcoming technical assembly.
          </p>
        </div>
      </div>

      {/* Section fields container */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5`}>
        {/* Event Title */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            EVENT TITLE
          </span>
          <input
            type="text"
            placeholder="e.g. Q4 SYSTEM ARCHITECTURE REVIEW"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] Title payload parameter is required.
            </span>
          )}
        </div>

        {/* Max Members */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            MAX MEMBERS
          </span>
          <input
            type="number"
            min="1"
            placeholder="0"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
            {...register("max_group_members", { required: true, valueAsNumber: true })}
          />
          {errors.max_group_members && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] Parameter must be a valid integer.
            </span>
          )}
        </div>

        {/* Location / Node */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            LOCATION / NODE
          </span>
          <input
            type="text"
            placeholder="e.g. DISTRIBUTED // HUB_A"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
            {...register("location", { required: true })}
          />
          {errors.location && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] Node location coordinates required.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
