/**
 * PURPOSE:
 * Client Component for the Incoming Invitations dashboard.
 * It manages invitations state, dynamically calculates pending sync requests count,
 * paginates cards client-side (3 items per page), and wraps the view in a retro console UI.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/invitations/page.tsx' to serve user invitations list.
 *
 * INPUTS / PARAMETERS:
 * - invitations (InvitationWithGroupsEvent[] | null, Required): Initial invitations list.
 * - user (User, Required): Authenticated user session.
 */

'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User } from "@supabase/supabase-js"
import { InvitationWithGroupsEvent } from "../types/invitation"
import { INVITATION_STATUS } from "../types/enum"
import BackButton from "@/app/components/BackButton"
import Pagination from "@/app/helpers/Pagination"
import InvitationCard from "./components/InvitationCard"

export default function InvitationsClient({
  invitations,
  user,
}: {
  invitations: Array<InvitationWithGroupsEvent> | null
  user: User
}) {
  const [localInvitations, setLocalInvitations] = useState<InvitationWithGroupsEvent[]>(
    invitations || []
  )
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  /**
   * BEHAVIORAL MECHANISM:
   * Event callback triggered when a child card accepts/rejects, syncing local state and parent totals.
   *
   * PARAMETERS:
   * - inviteId (string): The targeted invitation database UUID.
   * - newStatus (string): The resolved status value (accepted/rejected).
   *
   * RETURNS:
   * - void
   */
  const handleStatusUpdate = (inviteId: string, newStatus: INVITATION_STATUS): void => {
    const updatedInvitations = localInvitations.map((invitation) => {
      if (inviteId == invitation.id) {
        return { ...invitation, invitation_status: newStatus }
      }
      return invitation
    })
    setLocalInvitations(updatedInvitations)
  }

  // Count pending invitations to show dynamic telemetry
  const pendingCount = localInvitations.filter(
    inv => inv.invitation_status === INVITATION_STATUS.PENDING
  ).length
  const formattedCount = String(pendingCount).padStart(2, '0')

  // Pagination calculation
  const totalItems = localInvitations.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvitations = localInvitations.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Back navigation button */}
      <BackButton />

      {/* Header Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-4">
        <div className="flex gap-4 items-stretch">
          {/* Solid vertical mint border line */}
          <div className="w-[3px] bg-[#00e0b3]" />

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              SYSTEM_REGISTRY //
              <br />
              INCOMING_INVITATIONS
            </h1>
            <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex items-center gap-2">
              <span>Total Pending Sync Requests:</span>
              <span className="text-[#00e0b3] font-bold">{formattedCount}</span>
            </div>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase self-start md:self-center select-none">
          [AUTH_VERIFIED]
        </div>
      </div>

      {/* Invitations Grid/List */}
      <div className="flex flex-col gap-5 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {paginatedInvitations.length > 0 ? (
            paginatedInvitations.map((invite, idx) => (
              <motion.div
                key={invite.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <InvitationCard
                  invite={invite}
                  user={user}
                  onStatusUpdate={handleStatusUpdate}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 border border-dashed border-white/5 py-20 rounded-sm text-[#83958d] font-mono text-center"
            >
              <span className="material-symbols-outlined text-4xl">inbox</span>
              <span className="text-[9px] tracking-widest uppercase">
                NO INCOMING INVITATIONS REGISTERED
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Local Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </div>
      )}
    </div>
  )
}