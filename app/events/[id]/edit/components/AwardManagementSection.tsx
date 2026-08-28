/**
 * PURPOSE:
 * Renders the awards management configuration panel.
 * Allows creating new awards and updating existing awards using react-hook-form.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in EditEventClient.tsx under 'app/events/[id]/edit/components/AwardManagementSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - receivedAwards (EventAwardsInsert[], Required): Preloaded event awards list.
 * - eventId (string, Required): The event ID.
 * - page (string, Required): The active configuration tab view indicator.
 */

'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import type { createEventAwarđ } from "@/app/actions/event_awards/post/createEventAward"
import type { updateEventAward } from "@/app/actions/event_awards/put/updateEventAward"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { EventAwardsInsert } from "@/app/types/event_awards"
import { tw } from "@/app/constants/design-tokens"

interface AwardManagementSectionProps {
  receivedAwards: Array<EventAwardsInsert>
  eventId: string
  page: string
  actions: {
    createEventAwarđ: typeof createEventAwarđ
    updateEventAward: typeof updateEventAward
  }
}

export default function AwardManagementSection({
  receivedAwards,
  eventId,
  page,
  actions,
}: AwardManagementSectionProps) {
  const [awards, setAwards] = useState<Array<EventAwardsInsert>>(receivedAwards)
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventAwardsInsert>({
    defaultValues: {
      award_type: "participant",
    },
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Handles creating new event award. Sets event_id reference, clears id to trigger insertion,
   * calls createEventAwarđ server action, updates local state, and resets the form.
   *
   * PARAMETERS:
   * - newAward (EventAwardsInsert): Award fields values from form.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleCreateNewAward = async (newAward: EventAwardsInsert): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const payload = {
        ...newAward,
        event_id: eventId,
      }
      const { data, error } = await actions.createEventAwarđ(payload)
      if (error) {
        throw new Error(error)
      }
      if (!data) {
        throw new Error("Failed to retrieve newly created award.")
      }
      setAwards([...awards, data])
      reset({
        award_title: "",
        award_type: "participant",
        award_priority: undefined,
      })
      showNotification("Create award successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to create award.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Handles updating an existing event award.
   *
   * PARAMETERS:
   * - updatedAward (EventAwardsInsert): Modified award fields values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleUpdateAward = async (updatedAward: EventAwardsInsert): Promise<void> => {
    if (!updatedAward.id) {
      showNotification("Please select an existing award block from the registry below to update.")
      return
    }
    setIsOpenLoader(true)
    try {
      const { error } = await actions.updateEventAward(updatedAward)
      if (error) {
        throw new Error(error)
      }
      const updatedList = awards.map((item) => {
        if (item.id === updatedAward.id) {
          return updatedAward
        }
        return item
      })
      setAwards(updatedList)
      showNotification("Update award successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to update award.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Populates the input form fields with an selected award record for editing.
   *
   * PARAMETERS:
   * - selectedAward (EventAwardsInsert): Preloaded award data parameters.
   *
   * RETURNS:
   * - void
   */
  const handleChooseAward = (selectedAward: EventAwardsInsert): void => {
    reset(selectedAward)
  }

  if (page !== "awards") {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Award input form */}
      <div className="w-full pb-8 border-b border-white/5">
        <form className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5 w-full`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Award Title */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                AWARD TITLE
              </span>
              <input
                type="text"
                placeholder="e.g. GRAND CHAMPION"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("award_title", { required: "Award title is required" })}
              />
              {errors.award_title && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.award_title.message}
                </span>
              )}
            </div>

            {/* Award Type */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                AWARD TYPE
              </span>
              <div className="relative flex items-center">
                <select
                  className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
                  {...register("award_type", { required: "Award type is required" })}
                >
                  <option value="participant">PARTICIPANT</option>
                  <option value="general">GENERAL</option>
                  <option value="specific">SPECIFIC</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 text-xs text-[#83958d] pointer-events-none">
                  keyboard_arrow_down
                </span>
              </div>
              {errors.award_type && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.award_type.message}
                </span>
              )}
            </div>

            {/* Award Priority */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                AWARD PRIORITY
              </span>
              <input
                type="number"
                placeholder="e.g. 1"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("award_priority", {
                  required: "Priority is required",
                  valueAsNumber: true,
                })}
              />
              {errors.award_priority && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.award_priority.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4 select-none justify-end mt-2">
            <button
              type="button"
              onClick={handleSubmit(handleUpdateAward)}
              className="px-5 py-2.5 bg-[#151312] border border-[#00e0b3]/20 hover:border-[#00e0b3]/50 hover:bg-[#00e0b3]/5 transition-all text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest rounded-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">save</span>
              SAVE_CHANGES
            </button>
            <button
              type="button"
              onClick={handleSubmit(handleCreateNewAward)}
              className="px-5 py-2.5 bg-[#00e0b3] text-[#00382b] font-mono text-[10px] uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs font-bold">add</span>
              CREATE_AWARD
            </button>
          </div>
        </form>
      </div>

      {/* Awards list registry */}
      {awards.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          {awards
            .sort((a, b) => (a.award_priority ?? 0) - (b.award_priority ?? 0))
            .map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleChooseAward(item)}
                className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-4 hover:border-[#00e0b3]/30 transition-all cursor-pointer flex items-center justify-between relative group w-full`}
              >
                <div className="flex items-center gap-6 select-none max-w-[80%]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-[#e8e1df] uppercase">
                      {item.award_title}
                    </span>
                    <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
                      TYPE: {item.award_type?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 select-none">
                  <span className="text-[#00e0b3] font-mono font-bold text-[9px] shrink-0 border border-[#00e0b3]/20 px-2 py-0.5 rounded-sm">
                    Priority: {item.award_priority}
                  </span>
                  
                  <span className="text-[7px] font-mono text-[#00e0b3] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    [EDIT_AWARD]
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
