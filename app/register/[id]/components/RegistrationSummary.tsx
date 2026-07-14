'use client'

import Link from "next/link"

import Image from "next/image"
import { useWatch, Control } from "react-hook-form"
import { Event } from "@/app/types/event"
import GroupNameDisplay from "./GroupNameDisplay"
import { tw } from "@/app/constants/design-tokens"
import { RegisterGroupMember } from "@/app/types/group_member"

interface RegistrationSummaryProps {
  event: Event
  control: Control<RegisterGroupMember>
  initialMemberCount: number
  getUrl: (path: string) => string
}

/**
 * PURPOSE:
 * Renders the sticky right-hand Registration Summary sidebar. It displays a live preview
 * of the registration state: event name, live group name (via GroupNameDisplay), initial
 * member count, and count of selected challenges. Also shows the event poster image if
 * available. All live-updating fields use isolated useWatch sub-components to avoid
 * re-rendering the entire sidebar on every keystroke.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/register/[id]/RegisterClient.tsx' and placed in
 * 'app/register/[id]/components/RegistrationSummary.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): The full event record, used for event name and poster.
 * - control (Control<RegisterForm>, Required): react-hook-form control forwarded to child watchers.
 * - initialMemberCount (number, Required): Total allowed group size (max_group_members).
 * - getUrl ((path: string) => string, Required): Resolves a storage path to a public URL.
 */
export default function RegistrationSummary({
  event,
  control,
  initialMemberCount,
  getUrl,
}: RegistrationSummaryProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Subscribes to the 'challenges' field to derive a live count of selected challenges
   * for display in the summary. Isolated to avoid unnecessary parent re-renders since
   * useWatch is scoped to this component.
   *
   * PARAMETERS:
   * None — reads from context via control.
   *
   * RETURNS:
   * - number: The number of currently selected challenge IDs.
   */
  const selectedChallenges = useWatch({ name: "challenges", control }) ?? []
  const challengeCount = selectedChallenges.length

  return (
    <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8 lg:self-start">
      {/* Summary Panel */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <span className="text-xs font-mono font-bold uppercase tracking-widest">
            Registration_Summary
          </span>
          <span className="material-symbols-outlined text-xs text-[#00e0b3]">assignment</span>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Event Name */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
              Event_Name
            </span>
            <span className="text-[11px] font-mono font-bold text-[#e8e1df] uppercase">
              {event.title ?? 'N/A'}
            </span>
          </div>

          {/* Group Name — live preview */}
          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
              Group_Name
            </span>
            {/* GroupNameDisplay is isolated — only it re-renders on typing */}
            <GroupNameDisplay control={control} />
          </div>

          {/* Initial Members */}
          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
              Initial_Members
            </span>
            <span className="text-[11px] font-mono font-bold text-[#00e0b3]">
              {initialMemberCount}_Units
            </span>
          </div>

          {/* Challenges Selected — live count */}
          <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
              Challenges_Selected
            </span>
            <span className={`text-[11px] font-mono font-bold ${challengeCount > 0 ? 'text-[#00e0b3]' : 'text-[#83958d]'}`}>
              {challengeCount}_Init
            </span>
          </div>

          {/* Warning notice */}
          <div className="border border-[#00e0b3]/10 bg-[#00e0b3]/5 rounded-sm p-3 mt-2">
            <p className="text-[9px] font-mono text-[#83958d] leading-relaxed">
              [WARNING]: Group registration requires all member to be registered on the ITEE SPOT platform before getting included in a group
            </p>
          </div>
        </div>
      </div>

      {/* Event Poster */}
      {event.poster_path && (
        <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}>
          <div className="relative w-full h-40">
            <Image
              src={getUrl(event.poster_path)}
              alt={event.title ?? "Event poster"}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover opacity-60 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1b1a]/80 to-transparent" />
          </div>
          <div className="px-4 py-3 border-t border-white/5">
            <Link href={`/events/${event.id}`} className="text-[9px] font-mono text-[#00e0b3] uppercase tracking-widest hover:underline">
              Visual_Event_Protocol
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}


