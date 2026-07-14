'use client'

import { useWatch, Control, FieldErrors, UseFormRegister } from "react-hook-form"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { RegisterForm } from "../RegisterClient"
import { tw } from "@/app/constants/design-tokens"

interface ChallengeSectionProps {
  register: UseFormRegister<RegisterForm>
  errors: FieldErrors<RegisterForm>
  control: Control<RegisterForm>
  challenges: EventChallengeInsert[]
}

/**
 * PURPOSE:
 * Renders the protocol challenge selection section. Displays all available event challenges
 * as a styled 2-column checkbox grid. Each challenge card highlights with a mint border
 * when its checkbox is selected. A validation error is shown if no challenge is selected
 * on form submission.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/register/[id]/RegisterClient.tsx' and placed in
 * 'app/register/[id]/components/ChallengeSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - register (UseFormRegister<RegisterForm>, Required): react-hook-form register function.
 * - errors (FieldErrors<RegisterForm>, Required): Form validation error map.
 * - control (Control<RegisterForm>, Required): Used to read selected challenges for highlight state.
 * - challenges (EventChallengeInsert[], Required): The list of available challenges for this event.
 */
export default function ChallengeSection({
  register,
  errors,
  control,
  challenges,
}: ChallengeSectionProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Subscribes to the 'challenges' field value via useWatch. This is used to derive
   * whether each individual challenge card is currently selected, driving the
   * visual highlight state of the card border and background without requiring
   * the parent form to re-render.
   *
   * PARAMETERS:
   * None — reads from context via control.
   *
   * RETURNS:
   * - string[]: The currently selected challenge IDs.
   */
  const selectedChallenges = useWatch({ name: "challenges", control }) ?? []

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <span className="material-symbols-outlined text-sm text-[#00e0b3]">checklist</span>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
          Select_Protocol_Challenges
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challenges.map((challenge) => {
            const isChecked = selectedChallenges.includes(challenge.id ?? "")
            return (
              <label
                key={challenge.id}
                className={`relative flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all duration-300 ${
                  isChecked
                    ? 'border-[#00e0b3]/40 bg-[#00e0b3]/5'
                    : 'border-white/5 bg-[#151312]/40 hover:border-white/10'
                }`}
              >
                {/* Hidden checkbox — registered with react-hook-form */}
                <input
                  type="checkbox"
                  value={challenge.id ?? ""}
                  className="sr-only"
                  {...register('challenges', {
                    validate: (value) => {
                      if (!value || value.length === 0) return "Please select at least one challenge"
                      return true
                    }
                  })}
                />

                {/* Custom checkbox indicator */}
                <div className={`shrink-0 mt-0.5 w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-all ${
                  isChecked ? 'border-[#00e0b3] bg-[#00e0b3]/20' : 'border-white/20'
                }`}>
                  {isChecked && (
                    <span className="material-symbols-outlined text-[8px] text-[#00e0b3]">check</span>
                  )}
                </div>

                {/* Challenge text */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  {challenge.company_name && (
                    <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider truncate">
                      {challenge.company_name}
                    </span>
                  )}
                  <span className={`text-xs font-mono font-bold truncate ${isChecked ? 'text-[#00e0b3]' : 'text-[#b9cbc2]'}`}>
                    {challenge.title ?? 'Unnamed Challenge'}
                  </span>
                </div>
              </label>
            )
          })}
        </div>

        {/* Validation error */}
        {errors.challenges?.message && (
          <p className="text-red-400 text-[10px] font-mono mt-4">
            {errors.challenges.message as string}
          </p>
        )}
      </div>
    </div>
  )
}
