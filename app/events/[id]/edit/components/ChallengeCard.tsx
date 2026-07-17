/**
 * PURPOSE:
 * Displays a single challenge entry item card with text inputs to inline-edit
 * the company name and title, and triggers updates instantly.
 *
 * CONTEXT/PARENT FILE:
 * Sibling subcomponent of ChallengeSection.tsx, located at 'app/events/[id]/edit/components/ChallengeCard.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - receivedChallenge (EventChallengeInsert, Required): Preloaded challenge record data parameters.
 */

'use client'

import { useState } from "react"
import { updateEventChallenges } from "@/app/actions/events"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { tw } from "@/app/constants/design-tokens"

interface ChallengeCardProps {
  receivedChallenge: EventChallengeInsert
}

export default function ChallengeCard({ receivedChallenge }: ChallengeCardProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()
  const [challenge, setChallenge] = useState<EventChallengeInsert>(receivedChallenge)

  /**
   * BEHAVIORAL MECHANISM:
   * Saves challenge edits by calling updateEventChallenges server action.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleUpdateChallenge = async (): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await updateEventChallenges({ eventChallenge: challenge })
      if (error) {
        throw new Error(error)
      }
      showNotification("Update challenge successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to update challenge details.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end`}>
      {/* Company Name */}
      <div className="flex flex-col gap-1.5 sm:col-span-5">
        <span className="text-[7px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
          COMPANY_NAME
        </span>
        <input
          type="text"
          placeholder="Company Name"
          value={challenge.company_name ?? ""}
          onChange={(e) => setChallenge({ ...challenge, company_name: e.target.value })}
          className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-2.5 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
        />
      </div>

      {/* Challenge Title */}
      <div className="flex flex-col gap-1.5 sm:col-span-5">
        <span className="text-[7px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
          CHALLENGE_TITLE
        </span>
        <input
          type="text"
          placeholder="Challenge Title"
          value={challenge.title ?? ""}
          onChange={(e) => setChallenge({ ...challenge, title: e.target.value })}
          className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-2.5 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
        />
      </div>

      {/* Save Button */}
      <div className="sm:col-span-2 select-none w-full">
        <button
          type="button"
          onClick={handleUpdateChallenge}
          className="py-2.5 bg-[#151312] border border-[#00e0b3]/20 hover:border-[#00e0b3]/50 hover:bg-[#00e0b3]/5 transition-all text-[#00e0b3] font-mono text-[9px] uppercase font-bold tracking-wider rounded-sm w-full cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-xs">save</span>
          SAVE
        </button>
      </div>
    </div>
  )
}
