/**
 * PURPOSE:
 * Renders the Temporal Logistics form section for the Event Creation panel.
 * Contains input controls for Start Date, End Date, and Organization Milestone Date & Time.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of CreateEventClient.tsx, located at 'app/events/create/components/TemporalLogisticsSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<EventInsert>, Required): react-hook-form register callback.
 * - errors (FieldErrors<EventInsert>, Required): react-hook-form errors validation map.
 */

'use client'

import { UseFormRegister, FieldErrors } from "react-hook-form"
import { EventInsert } from "@/app/types/event"
import { tw } from "@/app/constants/design-tokens"

interface TemporalLogisticsSectionProps {
  register: UseFormRegister<EventInsert>
  errors: FieldErrors<EventInsert>
}

export default function TemporalLogisticsSection({ register, errors }: TemporalLogisticsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-white/5">
      {/* Section description side */}
      <div className="lg:col-span-4 flex gap-3 select-none">
        <div className="w-[2px] h-4 bg-[#00e0b3] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h2 className="font-mono text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
            TEMPORAL_LOGISTICS
          </h2>
          <p className="text-[9.5px] font-mono text-[#83958d] leading-relaxed">
            Configure the execution window and organizational milestones.
          </p>
        </div>
      </div>

      {/* Section fields container */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5`}>
        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            START DATE
          </span>
          <input
            type="date"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full select-none"
            {...register("start_date", { required: true })}
          />
          {errors.start_date && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] Start timestamp payload required.
            </span>
          )}
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            END DATE
          </span>
          <input
            type="date"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full select-none"
            {...register("end_date", { required: true })}
          />
          {errors.end_date && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] End timestamp payload required.
            </span>
          )}
        </div>

        {/* Organization Timestamp */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
            ORGANIZATION TIMESTAMP (DATE & TIME)
          </span>
          <input
            type="datetime-local"
            className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full select-none"
            {...register("organized_date", { required: true })}
          />
          {errors.organized_date && (
            <span className="text-[7px] font-mono text-red-400 uppercase select-none">
              [!] Assembly milestone target datetime required.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
