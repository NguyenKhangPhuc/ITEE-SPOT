/**
 * PURPOSE:
 * Renders the tabular display of group registry records for administrators.
 * Includes expandable accordion rows displaying detailed group members and group challenges,
 * along with action triggers for member removal and challenge deletion wrapped with DynamicModal confirmation.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/group-management/GroupManagementClient.tsx' to modularize table rendering.
 *
 * INPUTS / PARAMETERS:
 * - paginatedGroups (AdminGroups[], Required): Array of group data records segment for the active page.
 * - startIndex (number, Required): Sequential count offset index based on active pagination page.
 * - expandedGroupId (string | null, Required): Currently expanded group ID for accordion dropdown.
 * - toggleExpandGroup ((groupId: string) => void, Required): Function to toggle row expansion.
 * - handleRemoveMember ((memberId: string, groupId: string) => Promise<void>, Required): Callback function to remove a member.
 * - handleDeleteChallenge ((groupChallengeId: string, groupId: string) => Promise<void>, Required): Callback function to delete a challenge.
 * - totalGroupsCount (number, Required): Count of groups matching active filters.
 */

'use client'

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminGroups } from "@/app/types/group"
import { tw } from "@/app/constants/design-tokens"
import { DynamicModal } from "@/app/components/DynamicModal"

interface GroupTableProps {
  paginatedGroups: Array<AdminGroups>
  startIndex: number
  expandedGroupId: string | null
  toggleExpandGroup: (groupId: string) => void
  handleRemoveMember: (memberId: string, groupId: string) => Promise<void>
  handleDeleteChallenge: (groupChallengeId: string, groupId: string) => Promise<void>
  totalGroupsCount: number
}

interface ConfirmModalState {
  isOpen: boolean
  title: string
  subTitle: string
  onConfirm: () => void
}

export default function GroupTable({
  paginatedGroups,
  startIndex,
  expandedGroupId,
  toggleExpandGroup,
  handleRemoveMember,
  handleDeleteChallenge,
  totalGroupsCount,
}: GroupTableProps) {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    subTitle: "",
    onConfirm: () => {},
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers confirmation modal prior to removing a group member.
   *
   * PARAMETERS:
   * - memberId (string): Primary key ID of the group member.
   * - groupId (string): Associated group ID.
   * - memberName (string): Full name or email of member to display in modal.
   */
  const promptRemoveMember = (memberId: string, groupId: string, memberName: string): void => {
    setConfirmModal({
      isOpen: true,
      title: `Delete user ${memberName}`,
      subTitle: "Remove user will permanently remove user from the groups. Are you sure?",
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        handleRemoveMember(memberId, groupId)
      },
    })
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers confirmation modal prior to deleting a group challenge.
   *
   * PARAMETERS:
   * - groupChallengeId (string): Primary key ID of the group challenge.
   * - groupId (string): Associated group ID.
   * - challengeTitle (string): Title of challenge to display in modal.
   */
  const promptDeleteChallenge = (groupChallengeId: string, groupId: string, challengeTitle: string): void => {
    setConfirmModal({
      isOpen: true,
      title: `Delete challenge ${challengeTitle}`,
      subTitle: "Remove the group challenge will also remove permanently the submission of that challenge. Are you sure?",
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        handleDeleteChallenge(groupChallengeId, groupId)
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table Metrics Header */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
          <div className="w-[3px] h-3 bg-[#00e0b3]" />
          <span>01_GROUP_REGISTRY_DATABASE</span>
        </div>
        <span className="font-mono text-[9px] text-[#83958d]">
          TOTAL_GROUPS: {totalGroupsCount}
        </span>
      </div>

      {/* Scrollable Container */}
      <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-x-auto`}>
        <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider">
              <th className="p-4 font-bold text-center w-12">NO</th>
              <th className="p-4 font-bold text-center w-12">DETAILS</th>
              <th className="p-4 font-bold">GROUP_NAME</th>
              <th className="p-4 font-bold">EVENT_TITLE</th>
              <th className="p-4 font-bold text-center w-28">MEMBERS</th>
              <th className="p-4 font-bold text-center w-28">CHALLENGES</th>
              <th className="p-4 font-bold text-right w-36">CREATED_AT</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGroups.length > 0 ? (
              paginatedGroups.map((group, index) => {
                const isExpanded = expandedGroupId === group.id
                const members = group.group_members
                const challenges = group.group_challenge
                const memberCount = members.length
                const challengeCount = challenges.length

                return (
                  <React.Fragment key={group.id}>
                    {/* Main Group Row */}
                    <tr
                      onClick={() => toggleExpandGroup(group?.id ?? "")}
                      className={`border-b border-white/5 cursor-pointer transition-colors ${
                        isExpanded ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"
                      }`}
                    >
                      <td className="p-4 text-center font-bold text-[#83958d]">
                        {String(startIndex + index + 1).padStart(3, "0")}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`material-symbols-outlined text-sm text-[#00e0b3] transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      </td>
                      <td className="p-4 text-[#e8e1df] font-bold whitespace-nowrap">
                        {group.group_name || "UNNAMED_GROUP"}
                      </td>
                      <td className="p-4 text-[#83958d] whitespace-nowrap uppercase">
                        {group.events?.title || "UNASSIGNED_EVENT"}
                      </td>
                      <td className="p-4 text-center font-bold text-[#e8e1df]">
                        {memberCount}
                      </td>
                      <td className="p-4 text-center font-bold text-[#e8e1df]">
                        {challengeCount}
                      </td>
                      <td className="p-4 text-right text-[#83958d] whitespace-nowrap">
                        {group.created_at
                          ? new Date(group.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>

                    {/* Accordion Dropdown Section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-[#151312]/80 border-b border-white/5"
                        >
                          <td colSpan={7} className="p-6">
                            <div className="flex flex-col gap-6 w-full">
                              
                              {/* 1. Group Members Subsection */}
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-mono text-[#00e0b3] uppercase tracking-widest font-bold">
                                    GROUP MEMBERS ({memberCount})
                                  </span>
                                </div>

                                {memberCount > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {members.map((member) => (
                                      <div
                                        key={member.id}
                                        className="bg-[#1a1817] border border-white/5 rounded-sm p-3 flex items-center justify-between gap-3"
                                      >
                                        <div className="flex flex-col min-w-0">
                                          <span className="text-xs font-bold text-[#e8e1df] truncate">
                                            {member.profiles?.full_name || "UNNAMED_MEMBER"}
                                          </span>
                                          <span className="text-[9px] text-[#83958d] truncate">
                                            {member.profiles?.email || "NO_EMAIL"}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            promptRemoveMember(
                                              member.id!,
                                              group.id!,
                                              member.profiles?.full_name || member.profiles?.email || "UNNAMED_MEMBER"
                                            )
                                          }}
                                          className="px-2.5 py-1.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono text-[8px] uppercase font-bold tracking-wider rounded-sm transition-colors cursor-pointer shrink-0"
                                        >
                                          REMOVE
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-[9px] font-mono text-[#83958d] italic">
                                    NO MEMBERS REGISTERED IN THIS GROUP
                                  </div>
                                )}
                              </div>

                              {/* 2. Group Challenges Subsection */}
                              <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-mono text-[#00e0b3] uppercase tracking-widest font-bold">
                                    GROUP CHALLENGES ({challengeCount})
                                  </span>
                                </div>

                                {challengeCount > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {challenges.map((challenge) => (
                                      <div
                                        key={challenge.id}
                                        className="bg-[#1a1817] border border-white/5 rounded-sm p-3 flex items-center justify-between gap-3"
                                      >
                                        <div className="flex flex-col min-w-0">
                                          <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-wider font-bold">
                                            COMPANY: {challenge.event_challenges?.company_name || "N/A"}
                                          </span>
                                          <span className="text-xs font-bold text-[#e8e1df] truncate">
                                            TITLE: {challenge.event_challenges?.title || "UNNAMED_CHALLENGE"}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            promptDeleteChallenge(
                                              challenge.id!,
                                              group.id!,
                                              challenge.event_challenges?.title || "UNNAMED_CHALLENGE"
                                            )
                                          }}
                                          className="px-2.5 py-1.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-mono text-[8px] uppercase font-bold tracking-wider rounded-sm transition-colors cursor-pointer shrink-0"
                                        >
                                          DELETE
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-[9px] font-mono text-[#83958d] italic">
                                    NO CHALLENGES ASSIGNED TO THIS GROUP
                                  </div>
                                )}
                              </div>

                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[#83958d] select-none">
                  NO GROUP REGISTRY ENTRIES MATCHING ACTIVE FILTER PARAMETERS
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <DynamicModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        subTitle={confirmModal.subTitle}
        onSave={confirmModal.onConfirm}
        onDismiss={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        confirmText="I'm sure"
        cancelText="No"
      />
    </div>
  )
}
