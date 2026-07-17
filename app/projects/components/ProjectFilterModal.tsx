/**
 * PURPOSE:
 * Rethemed event filter modal component for filtering archive projects. Contains event selection checkboxes
 * and submission/reset action buttons.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/projects/ProjectsClient.tsx' to simplify the main archive component layout.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls whether the modal is visible.
 * - onClose (() => void, Required): Callback function when the modal is closed.
 * - events (EventInsert[], Required): List of contest events available for filtering.
 * - register (UseFormRegister<ProjectFilter>, Required): React Hook Form register function.
 * - handleSubmit (UseFormHandleSubmit<ProjectFilter>, Required): React Hook Form submit handler.
 * - onSubmit ((data: ProjectFilter) => void, Required): Form submission handler.
 * - onReset (() => void, Required): Reset handler to clear active filters.
 */

'use client'

import { UseFormRegister, UseFormHandleSubmit } from 'react-hook-form'
import { ProjectFilter } from '../../types/group'
import { EventInsert } from '../../types/event'
import { tw } from '@/app/constants/design-tokens'

interface ProjectFilterModalProps {
  isOpen: boolean
  onClose: () => void
  events: EventInsert[]
  register: UseFormRegister<ProjectFilter>
  handleSubmit: UseFormHandleSubmit<ProjectFilter>
  onSubmit: (data: ProjectFilter) => void
  onReset: () => void
}

export default function ProjectFilterModal({
  isOpen,
  onClose,
  events,
  register,
  handleSubmit,
  onSubmit,
  onReset,
}: ProjectFilterModalProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * The component renders a modal overlay that is visible only when isOpen is true.
   * It displays event selection checkboxes bound to the parent React Hook Form instance,
   * along with Cancel (close), Reset, and Apply buttons.
   *
   * PARAMETERS:
   * - props (ProjectFilterModalProps): Props containing form state, handlers, and the events list.
   *
   * RETURNS:
   * - React.JSX.Element | null: The modal markup if open, otherwise null.
   */
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 font-mono">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border overflow-y-auto max-h-[90vh] w-full max-w-xl p-6 rounded-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-300`}
      >
        {/* Grid circuit lines decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#83958d] hover:text-[#00e0b3] transition-colors p-1 rounded-sm cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-sm font-bold">close</span>
        </button>

        {/* Modal Heading */}
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#00e0b3] border-b border-white/5 pb-3 mb-5">
          Filter_Projects
        </h2>

        {/* Event selection checkboxes */}
        <div className="mb-6 flex flex-col gap-3">
          <span className="text-[9px] font-bold text-[#83958d] uppercase tracking-wider block">
            Filter_By_Events
          </span>
          <div className="flex flex-col gap-2.5 max-h-[240px] overflow-y-auto pr-1">
            {events.map((event) => (
              <label
                key={event.id}
                className="flex items-center gap-3 text-xs text-[#e8e1df] hover:text-white transition-colors cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  value={event.id ?? ''}
                  className="w-4 h-4 bg-[#151312] border border-white/10 rounded-sm accent-[#00e0b3] cursor-pointer"
                  {...register('events')}
                />
                <span className="leading-none">{event.title}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onReset}
            className="border border-white/10 bg-[#151312] hover:bg-white/5 text-[#83958d] hover:text-[#e8e1df] text-[10px] uppercase font-bold tracking-widest px-5 py-2.5 transition-all duration-300 rounded-sm cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            className="border border-[#00e0b3]/40 bg-[#00e0b3]/10 hover:bg-[#00e0b3] hover:text-[#00382b] text-[#00e0b3] text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 transition-all duration-300 rounded-sm cursor-pointer"
          >
            Apply_Filters
          </button>
        </div>
      </form>
    </div>
  )
}
