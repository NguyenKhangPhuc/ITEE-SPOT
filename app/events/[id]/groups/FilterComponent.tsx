'use client'

import { PROGRAMME, DEGREE } from "@/app/types/enum"
import { EventWithChallenges } from "@/app/types/event"
import { Filter } from "@/app/types/group"
import { SetStateAction } from "react"
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { tw } from "@/app/constants/design-tokens"

interface FilterComponentProp {
  handleSubmit: UseFormHandleSubmit<Filter, Filter>
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  register: UseFormRegister<Filter>
  event: EventWithChallenges
  onSubmit: (data: Filter) => void
  handleResetFilter: () => void
}

/**
 * PURPOSE:
 * Renders the filter parameters modal dialog. It displays checkboxes for selecting specific
 * challenges, degrees, and academic programmes. Rethemed to match the dark terminal uploader UI.
 *
 * CONTEXT/PARENT FILE:
 * Mounted as a modal overlay within EventGroupsClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - handleSubmit (UseFormHandleSubmit, Required): React Hook Form submit coordinator.
 * - setIsOpen (React.Dispatch, Required): Controls dialog visibility.
 * - register (UseFormRegister, Required): Form field registration helper.
 * - event (EventWithChallenges, Required): Active event model containing registered challenges.
 * - onSubmit ((data: Filter) => void, Required): Form submit callback.
 * - handleResetFilter (() => void, Required): Clears form checkbox states.
 */
export default function FilterComponent({
  handleSubmit,
  setIsOpen,
  event,
  register,
  onSubmit,
  handleResetFilter,
}: FilterComponentProp) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border overflow-y-auto max-h-[90vh] w-full max-w-xl p-6 rounded-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 font-mono`}
    >
      {/* Grid circuit lines decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      {/* Close button */}
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 text-[#83958d] hover:text-[#00e0b3] transition-colors p-1 rounded-sm cursor-pointer z-10"
      >
        <span className="material-symbols-outlined text-sm font-bold">close</span>
      </button>

      {/* Modal Heading */}
      <h2 className="text-sm font-bold uppercase tracking-widest text-[#00e0b3] border-b border-white/5 pb-3 mb-5">
        Filter_Parameters
      </h2>

      {/* Challenges checkboxes group */}
      <div className="mb-5">
        <span className="text-[9px] font-bold text-[#83958d] uppercase tracking-wider block mb-3">
          Filter_By_Challenges
        </span>
        <div className="flex flex-col gap-2.5">
          {event.event_challenges.map((challenge) => (
            <label
              key={challenge.id}
              className="flex items-center gap-3 text-xs text-[#e8e1df] hover:text-white transition-colors cursor-pointer select-none"
            >
              <input
                type="checkbox"
                value={challenge.title ?? ""}
                className="w-4 h-4 bg-[#151312] border border-white/10 rounded-sm accent-[#00e0b3] cursor-pointer"
                {...register("challenges")}
              />
              <span className="leading-none">{challenge.title}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-4 border-white/5" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Programme Selection */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-bold text-[#83958d] uppercase tracking-wider block">
            Filter_By_Programme
          </span>
          <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1">
            {Object.values(PROGRAMME).map((prog) => (
              <label
                key={prog}
                className="flex items-start gap-3 text-[11px] text-[#e8e1df] hover:text-white transition-colors cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  value={prog}
                  className="w-3.5 h-3.5 mt-0.5 bg-[#151312] border border-white/10 rounded-sm accent-[#00e0b3] cursor-pointer shrink-0"
                  {...register("programmes")}
                />
                <span className="leading-tight">{prog}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Degree Selection */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-bold text-[#83958d] uppercase tracking-wider block">
            Filter_By_Degree
          </span>
          <div className="flex flex-col gap-2.5">
            {Object.values(DEGREE).map((uni) => (
              <label
                key={uni}
                className="flex items-center gap-3 text-[11px] text-[#e8e1df] hover:text-white transition-colors cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  value={uni}
                  className="w-3.5 h-3.5 bg-[#151312] border border-white/10 rounded-sm accent-[#00e0b3] cursor-pointer shrink-0"
                  {...register("degrees")}
                />
                <span className="leading-none">{uni}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={handleResetFilter}
          className="border border-white/10 bg-[#151312] hover:bg-white/5 text-[#83958d] hover:text-[#e8e1df] text-[10px] uppercase font-bold tracking-widest px-5 py-2.5 transition-all duration-300 rounded-sm cursor-pointer"
        >
          Reset_All
        </button>
        <button
          type="submit"
          className="border border-[#00e0b3]/40 bg-[#00e0b3]/10 hover:bg-[#00e0b3] hover:text-[#00382b] text-[#00e0b3] text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 transition-all duration-300 rounded-sm cursor-pointer"
        >
          Apply_Filters
        </button>
      </div>
    </form>
  )
}