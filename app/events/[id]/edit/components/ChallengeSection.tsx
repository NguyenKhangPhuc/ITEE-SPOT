/**
 * PURPOSE:
 * Renders the Challenges management form section.
 * Allows creating new challenges and lists current challenges for editing.
 *
 * CONTEXT/PARENT FILE:
 * Sibling subcomponent of EditEventClient.tsx, located at 'app/events/[id]/edit/components/ChallengeSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - challenges (EventChallengeInsert[], Required): Preloaded challenges data array.
 * - setChallenges (React.Dispatch<React.SetStateAction<EventChallengeInsert[]>>, Required): State setter for challenges list.
 * - event (EventChallengeInsert, Required): Single event record reference to map event_id.
 * - page (string, Required): The active configuration tab view indicator.
 */

'use client'

import { useForm } from "react-hook-form"
import { createEventChallenge } from "@/app/actions/event_challenges/post/createEventChallenge"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { tw } from "@/app/constants/design-tokens"
import ChallengeCard from "./ChallengeCard"

interface ChallengeSectionProps {
  challenges: Array<EventChallengeInsert>
  setChallenges: React.Dispatch<React.SetStateAction<Array<EventChallengeInsert>>>
  event: EventChallengeInsert
  page: string
}

export default function ChallengeSection({
  challenges,
  setChallenges,
  event,
  page,
}: ChallengeSectionProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventChallengeInsert>()

  /**
   * BEHAVIORAL MECHANISM:
   * Handles creating new event challenges. Automatically appends the event_id reference,
   * adds the new challenge to the state array, and resets fields.
   *
   * PARAMETERS:
   * - challenge (EventChallengeInsert): Form field value data parameters.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleCreateNewChallenge = async (challenge: EventChallengeInsert): Promise<void> => {
    setIsOpenLoader(true)
    try {
      if (!event.id) {
        throw new Error("Failed to create challenge: event key is missing.")
      }
      challenge.event_id = event.id
      const { data, error } = await createEventChallenge(challenge)
      if (error) {
        throw new Error(error)
      }
      if (!data) {
        throw new Error("Failed to retrieve newly created challenge.")
      }
      setChallenges([...challenges, data])
      reset({
        company_name: "",
        title: "",
      })
      showNotification("Create challenge successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to create challenge.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  if (page !== "challenge") {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Challenge creation block */}
      <div className="w-full pb-8 border-b border-white/5">
        <form
          onSubmit={handleSubmit(handleCreateNewChallenge)}
          className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-6 w-full`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                COMPANY / SPONSOR
              </span>
              <input
                type="text"
                placeholder="Company Name"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("company_name", { required: "Company name is required" })}
              />
              {errors.company_name && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.company_name.message}
                </span>
              )}
            </div>

            {/* Challenge Title */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                CHALLENGE TITLE
              </span>
              <input
                type="text"
                placeholder="Challenge Title"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.title.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end select-none">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00e0b3] text-[#00382b] font-mono text-[10px] uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs font-bold">add</span>
              CREATE_CHALLENGE
            </button>
          </div>
        </form>
      </div>

      {/* Challenge listing block */}
      {challenges.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          {challenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id || index} receivedChallenge={challenge} />
          ))}
        </div>
      )}
    </div>
  )
}
