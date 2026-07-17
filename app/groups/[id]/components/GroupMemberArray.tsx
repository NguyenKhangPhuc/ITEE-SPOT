'use client'

import { motion } from "framer-motion"
import { GroupInfo } from "@/app/types/group"
import { InvitationInsert } from "@/app/types/invitation"
import { tw } from "@/app/constants/design-tokens"

interface GroupMemberArrayProps {
  groupMembers: NonNullable<GroupInfo>["group_members"]
  pendingInvitations: InvitationInsert[]
}

/**
 * PURPOSE:
 * This component displays the list of group members ("MEMBER_ARRAY") in a futuristic,
 * dark terminal style. It classifies the first member as the "Lead Node" with a "PRIMARY"
 * badge, and subsequent members as "Contributor" nodes. It also lists invited users as
 * "Pending Node" with an "awaiting_handshake" status label.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/groups/[id]/SingleGroupClient.tsx' and placed in
 * 'app/groups/[id]/components/GroupMemberArray.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - groupMembers (Array of group members, Required): Active group member profiles from groupInfo.
 * - pendingInvitations (InvitationInsert[], Required): Pending team invitations retrieved server-side.
 */
export default function GroupMemberArray({
  groupMembers,
  pendingInvitations,
}: GroupMemberArrayProps) {
  const activeCount = groupMembers.length + pendingInvitations.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden`}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-sm text-[#00e0b3]">group</span>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#00e0b3]">
            Member_Array
          </span>
        </div>
        <span className="text-[9px] font-mono text-[#83958d]">
          ACTIVE: {String(activeCount).padStart(2, "0")}
        </span>
      </div>

      <div className="p-6 flex flex-col gap-3">
        {/* Render Active Members */}
        {groupMembers.map((member, index) => {
          const isLead = index === 0
          return (
            <div
              key={`active-member-${member.id}`}
              className="flex items-center gap-4 p-4 bg-[#151312]/60 border border-white/5 rounded-sm"
            >
              {/* Node Icon */}
              <div className="w-10 h-10 bg-[#1d1b1a] border border-white/5 rounded-sm flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined text-base ${isLead ? 'text-[#00e0b3]' : 'text-[#83958d]'}`}>
                  {isLead ? "shield" : "person"}
                </span>
              </div>

              {/* Node Details */}
              <div className="flex-grow min-w-0">
                <div className="text-xs font-mono font-bold text-[#e8e1df]">
                  Team Member
                </div>
                <div className="text-[10px] font-mono text-[#83958d] truncate">
                  {member.profiles?.email ?? "N/A"}
                </div>
              </div>

              {/* Status Badge / Action */}
              {isLead ? (
                <div className="text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm select-none">
                  PRIMARY
                </div>
              ) : (
                <div className="text-white/10 select-none">
                  <span className="material-symbols-outlined text-sm">
                    fiber_manual_record
                  </span>
                </div>
              )}
            </div>
          )
        })}

        {/* Render Pending Invitations */}
        {pendingInvitations.map((invitation) => (
          <div
            key={`pending-invitation-${invitation.id}`}
            className="flex items-center gap-4 p-4 bg-[#151312]/30 border border-dashed border-white/5 rounded-sm opacity-80"
          >
            {/* Node Icon */}
            <div className="w-10 h-10 bg-[#1d1b1a] border border-dashed border-white/5 rounded-sm flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base text-[#83958d] animate-pulse">
                hourglass_empty
              </span>
            </div>

            {/* Node Details */}
            <div className="flex-grow min-w-0">
              <div className="text-xs font-mono font-bold text-[#83958d]">
                Pending Node
              </div>
              <div className="text-[10px] font-mono text-[#83958d] truncate">
                {invitation.member_email}
              </div>
            </div>

            {/* Handshake Label */}
            <div className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider select-none">
              awaiting_handshake
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
