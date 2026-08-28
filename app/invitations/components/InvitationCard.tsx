/**
 * PURPOSE:
 * Renders a single incoming invitation card matching the terminal console theme.
 * Displays event details, formatted date range, registry node ID, nested group details,
 * and button actions (ACCEPT_INVITATION / REJECT_INVITATION) on the right side.
 *
 * CONTEXT/PARENT FILE:
 * Sibling component of InvitationsClient.tsx, located at 'app/invitations/components/InvitationCard.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - invite (InvitationWithGroupsEvent, Required): Single invitation record.
 * - user (User, Required): Current authenticated user.
 * - onStatusUpdate ((inviteId: string, newStatus: string) => void, Required): Parent callback to sync pending counts.
 */

'use client'

import { useState } from "react"
import { User } from "@supabase/supabase-js"
import type { acceptInvitation } from "@/app/actions/invitations/put/acceptInvitation"
import type { rejectInvitation } from "@/app/actions/invitations/put/rejectInvitation"
import { useNotification } from "@/app/context/NotificationContext"
import { EVENT_STATUS, INVITATION_STATUS } from "@/app/types/enum"
import { InvitationWithGroupsEvent } from "@/app/types/invitation"
import { tw } from "@/app/constants/design-tokens"

interface InvitationCardProps {
  invite: InvitationWithGroupsEvent
  user: User
  onStatusUpdate: (inviteId: string, newStatus: INVITATION_STATUS) => void
  actions: {
    acceptInvitation: typeof acceptInvitation
    rejectInvitation: typeof rejectInvitation
  }
}

export default function InvitationCard({
  invite,
  user,
  onStatusUpdate,
  actions,
}: InvitationCardProps) {
  const [invitationStatus, setInvitationStatus] = useState(invite.invitation_status)
  const { showNotification } = useNotification()

  /**
   * BEHAVIORAL MECHANISM:
   * Formats start/end dates into a clean custom uppercase string range (e.g. "MAR 12 - MAR 15, 2024").
   *
   * PARAMETERS:
   * - start (string): Event start date ISO string.
   * - end (string): Event end date ISO string.
   *
   * RETURNS:
   * - string: Formatted range.
   */
  const formatDateRange = (start?: string, end?: string): string => {
    if (!start || !end) return "UNMAPPED_DATES"
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    const startM = months[startDate.getMonth()]
    const startD = String(startDate.getDate()).padStart(2, '0')
    
    const endM = months[endDate.getMonth()]
    const endD = String(endDate.getDate()).padStart(2, '0')
    const endY = endDate.getFullYear()
    
    if (startM === endM) {
      return `${startM} ${startD} - ${endD}, ${endY}`
    }
    return `${startM} ${startD} - ${endM} ${endD}, ${endY}`
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Accepts invitation, updates Supabase, sets local state, and notifies parent.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleAccept = async (): Promise<void> => {
    try {
      const { error } = await actions.acceptInvitation({
        invitationId: invite.id,
        groupId: invite.group_id!,
        userId: user.id
      })
      if (error) {
        throw new Error(error)
      }
      showNotification('Accepting Successfully')
      setInvitationStatus(INVITATION_STATUS.ACCEPTED)
      onStatusUpdate(invite.id, INVITATION_STATUS.ACCEPTED)
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      }
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Rejects invitation, updates Supabase, sets local state, and notifies parent.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleReject = async (): Promise<void> => {
    try {
      const { error } = await actions.rejectInvitation({ invitationId: invite.id })
      if (error) {
        throw new Error(error)
      }
      showNotification('Rejecting Successfully')
      setInvitationStatus(INVITATION_STATUS.REJECTED)
      onStatusUpdate(invite.id, INVITATION_STATUS.REJECTED)
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      }
    }
  }

  const eventTitle = invite.groups?.events?.title || "UNTITLED_EVENT"
  const eventStatus = invite.groups?.events?.status || "upcoming"
  const groupName = invite.groups?.group_name || "UNNAMED_GROUP"
  const eventIdMock = `EVT-${invite.groups?.events?.id?.slice(0, 6).toUpperCase() || "NODE"}`

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:border-white/10 transition-colors select-none`}>
      {/* Left Column: Event & Group Info */}
      <div className="flex-1 flex flex-col gap-4 w-full">
        {/* Title and Event Status Tag */}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            {eventTitle}
          </h2>
          <span className={`px-2 py-0.5 border text-[7px] font-bold font-mono rounded-sm uppercase tracking-widest ${
            eventStatus === EVENT_STATUS.ONGOING
              ? "border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3]"
              : "border-yellow-500/20 bg-yellow-500/5 text-yellow-500"
          }`}>
            [STATUS: {eventStatus}]
          </span>
        </div>

        {/* Date & Registry ID Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[8px] font-mono text-[#83958d] uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">calendar_today</span>
            {formatDateRange(invite.groups?.events?.start_date ?? undefined, invite.groups?.events?.end_date ?? undefined)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">fingerprint</span>
            ID: {eventIdMock}
          </span>
        </div>

        {/* Nested Group Info Box */}
        <div className="bg-[#151312] border border-white/5 p-4 rounded-sm w-full select-text">
          <span className="text-[7px] font-mono text-[#00e0b3] font-bold uppercase tracking-widest block mb-1">
            &gt;&gt; SOURCE_GROUP
          </span>
          <h3 className="text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider mb-2">
            {groupName.replace(/\s+/g, "_")}
          </h3>
          <p className="text-[10px] font-mono text-[#b9cbc2] leading-relaxed line-clamp-2">
            {invite.groups?.short_description || "No registry synopsis provided by this group."}
          </p>
        </div>
      </div>

      {/* Right Column: Actions Block */}
      <div className="w-full md:w-48 shrink-0 flex flex-col gap-2.5">
        {invitationStatus === INVITATION_STATUS.PENDING ? (
          <>
            <button
              onClick={handleAccept}
              className="w-full py-2.5 bg-[#00e0b3] text-[#00382b] font-mono text-[9px] font-bold tracking-widest uppercase rounded-sm hover:brightness-110 transition-all cursor-pointer text-center"
            >
              ACCEPT_INVITATION
            </button>
            <button
              onClick={handleReject}
              className="w-full py-2.5 border border-[#e8e1df]/10 text-[#e8e1df] font-mono text-[9px] font-bold tracking-widest uppercase rounded-sm hover:bg-white/5 transition-all cursor-pointer text-center"
            >
              REJECT_INVITATION
            </button>
          </>
        ) : (
          <div className={`w-full py-3 text-center rounded-sm font-mono text-[9px] font-bold tracking-widest uppercase select-none border ${
            invitationStatus === INVITATION_STATUS.ACCEPTED
              ? "border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3]"
              : "border-red-400/20 bg-red-400/5 text-red-400"
          }`}>
            {invitationStatus}
          </div>
        )}
      </div>
    </div>
  )
}
