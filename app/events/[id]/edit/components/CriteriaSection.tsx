/**
 * PURPOSE:
 * Renders the grading criteria configuration panel.
 * Supports adding new criteria parameters, selecting existing items to load into the form,
 * and saving changes.
 *
 * CONTEXT/PARENT FILE:
 * Sibling subcomponent of EditEventClient.tsx, located at 'app/events/[id]/edit/components/CriteriaSection.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - receivedCriteria (EventCriteriaInsert[], Required): Preloaded event grading criteria list.
 * - eventId (string, Required): The event ID.
 * - page (string, Required): The active configuration tab view indicator.
 */

'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import type { createEventCriteria } from "@/app/actions/event_criteria/post/createEventCriteria"
import type { updateEventCriteria } from "@/app/actions/event_criteria/put/updateEventCriteria"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { CRITERIA_TYPE } from "@/app/types/enum"
import { EventCriteriaInsert } from "@/app/types/event_criteria"
import { tw } from "@/app/constants/design-tokens"

interface CriteriaSectionProps {
  receivedCriteria: Array<EventCriteriaInsert>
  eventId: string
  page: string
  actions: {
    createEventCriteria: typeof createEventCriteria
    updateEventCriteria: typeof updateEventCriteria
  }
}

export default function CriteriaSection({
  receivedCriteria,
  eventId,
  page,
  actions,
}: CriteriaSectionProps) {
  const [criteria, setCriteria] = useState<Array<EventCriteriaInsert>>(receivedCriteria)
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<EventCriteriaInsert>()

  /**
   * BEHAVIORAL MECHANISM:
   * Adds a newly defined grading criteria record. Spawns database insertion and appends to the criteria list.
   *
   * PARAMETERS:
   * - newCriteria (EventCriteriaInsert): Criteria input values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleAddingCriteria = async (newCriteria: EventCriteriaInsert): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { data, error } = await actions.createEventCriteria({ newCriteria, eventId })
      if (error) {
        throw new Error(error)
      }
      if (!data) {
        throw new Error("Failed to retrieve newly created criteria.")
      }
      setCriteria([...criteria, data])
      reset({
        criteria_name: "",
        percentage: undefined,
        criteria_description: "",
        type: undefined,
      })
      showNotification("Create criteria successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to create criteria.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Loads an existing criteria item's fields into the active input form for quick editing.
   *
   * PARAMETERS:
   * - existedCriteria (EventCriteriaInsert): Preloaded criteria data parameters.
   *
   * RETURNS:
   * - void
   */
  const handleChooseEventCriteria = (existedCriteria: EventCriteriaInsert): void => {
    reset(existedCriteria)
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Saves edits to the currently selected or defined criteria item by triggering database updates.
   *
   * PARAMETERS:
   * - existedCriteria (EventCriteriaInsert): Modified criteria fields values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleSaveCriteria = async (existedCriteria: EventCriteriaInsert): Promise<void> => {
    if (!existedCriteria.id) {
      showNotification("Please select an existing criteria block from the grid to update.")
      return
    }
    setIsOpenLoader(true)
    try {
      const { error } = await actions.updateEventCriteria({ updatedCriteria: existedCriteria })
      if (error) {
        throw new Error(error)
      }
      const updatedList = criteria.map((ele) => {
        if (ele.id === existedCriteria.id) {
          return existedCriteria
        }
        return ele
      })
      setCriteria(updatedList)
      showNotification("Update criteria successfully")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to save criteria.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  if (page !== "criteria") {
    return null
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Criteria input form */}
      <div className="w-full pb-8 border-b border-white/5">
        <form className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col gap-5 w-full`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Criteria Name */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                CRITERIA NAME
              </span>
              <input
                type="text"
                placeholder="e.g. CODE_QUALITY"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("criteria_name", { required: "Criteria Name is required" })}
              />
              {errors.criteria_name && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.criteria_name.message}
                </span>
              )}
            </div>

            {/* Percentage */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                PERCENTAGE (%)
              </span>
              <input
                type="number"
                placeholder="1-100"
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full"
                {...register("percentage", {
                  required: "Required",
                  min: { value: 1, message: "Min 1" },
                  max: { value: 100, message: "Max 100" },
                  valueAsNumber: true,
                })}
              />
              {errors.percentage && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.percentage.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                DESCRIPTION
              </span>
              <textarea
                placeholder="Describe this criteria..."
                rows={3}
                className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full resize-none"
                {...register("criteria_description", { required: "Description is required" })}
              />
              {errors.criteria_description && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.criteria_description.message}
                </span>
              )}
            </div>

            {/* Criteria Type */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[7.5px] font-mono text-[#83958d] uppercase tracking-widest font-bold select-none">
                CRITERIA TYPE
              </span>
              <div className="relative flex items-center">
                <select
                  className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-xs p-3 pr-8 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer"
                  {...register("type", { required: "Type is required" })}
                >
                  <option value="" disabled defaultValue={CRITERIA_TYPE.NORMAL}>
                    CHOOSE TYPE
                  </option>
                  <option value={CRITERIA_TYPE.NORMAL}>NORMAL</option>
                  <option value={CRITERIA_TYPE.SPECIFIC}>SPECIFIC</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 text-xs text-[#83958d] pointer-events-none">
                  keyboard_arrow_down
                </span>
              </div>
              {errors.type && (
                <span className="text-[7px] font-mono text-red-400 uppercase select-none">
                  [!] {errors.type.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4 select-none justify-end mt-2">
            <button
              type="button"
              onClick={handleSubmit(handleSaveCriteria)}
              className="px-5 py-2.5 bg-[#151312] border border-[#00e0b3]/20 hover:border-[#00e0b3]/50 hover:bg-[#00e0b3]/5 transition-all text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest rounded-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">save</span>
              SAVE_CHANGES
            </button>
            <button
              type="button"
              onClick={handleSubmit(handleAddingCriteria)}
              className="px-5 py-2.5 bg-[#00e0b3] text-[#00382b] font-mono text-[10px] uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs font-bold">add</span>
              CREATE_CRITERIA
            </button>
          </div>
        </form>
      </div>

      {/* Criteria list block */}
      {criteria.length > 0 && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
          {criteria.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => handleChooseEventCriteria(item)}
              className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-5 hover:border-[#00e0b3]/30 transition-all cursor-pointer flex flex-col gap-3 min-h-[160px] relative group`}
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-2 select-none">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="font-mono text-xs font-bold text-[#e8e1df] truncate">
                    {item.criteria_name?.toUpperCase()}
                  </span>
                  <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest font-bold">
                    TYPE: {item.type?.toUpperCase()}
                  </span>
                </div>
                <span className="text-[#00e0b3] font-mono font-bold text-xs shrink-0">
                  {item.percentage}%
                </span>
              </div>

              {/* Description content */}
              <p className="text-[9.5px] font-mono text-[#b9cbc2] leading-relaxed line-clamp-4 select-text">
                {item.criteria_description || "No description registry parameters provided."}
              </p>

              {/* Hover indicator overlay */}
              <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
                <span className="text-[7px] font-mono text-[#00e0b3] font-bold tracking-widest">
                  [EDIT_MODULE]
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
