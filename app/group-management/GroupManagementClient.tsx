/**
 * PURPOSE:
 * Client Component for the Group Management Dashboard.
 * Manages group state, search filtering, event filtering, created_at sorting,
 * client-side pagination, and accordion row expand states. Renders child components
 * GroupFilters and GroupTable from the local 'components/' folder.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/group-management/page.tsx' and 'app/group_management/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - groups (AdminGroups[], Required): Array of group records with nested events, members, and challenges.
 */

'use client'

import { useState } from "react"
import { AdminGroups } from "@/app/types/group"
import { runGroupMemberAction } from "@/app/actions/group_member/actions.gateway"
import { runGroupChallengeAction } from "@/app/actions/group_challenge/actions.gateway"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import BackButton from "@/app/components/BackButton"
import Pagination from "@/app/helpers/Pagination"
import GroupFilters from "./components/GroupFilters"
import GroupTable from "./components/GroupTable"

interface GroupManagementClientProps {
  groups: Array<AdminGroups>
}

const ITEMS_PER_PAGE = 20

export default function GroupManagementClient({ groups: initialGroups }: GroupManagementClientProps) {
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const [groupsList, setGroupsList] = useState<Array<AdminGroups>>(initialGroups)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [eventFilter, setEventFilter] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)

  // Extract unique events for the filter dropdown
  const uniqueEvents = Array.from(
    new Set(
      groupsList
        .map((g) => g.events?.title)
        .filter((title): title is string => Boolean(title))
    )
  )

  /**
   * BEHAVIORAL MECHANISM:
   * Toggles the accordion expand state for a target group row.
   *
   * PARAMETERS:
   * - groupId (string): The target group ID.
   *
   * RETURNS:
   * - void
   */
  const toggleExpandGroup = (groupId: string): void => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId))
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Removes a group member using server action and updates local state.
   *
   * PARAMETERS:
   * - memberId (string): Primary key ID of the group member.
   * - groupId (string): Associated group ID.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleRemoveMember = async (memberId: string, groupId: string): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await runGroupMemberAction({ type: 'deleteGroupMemberById', payload: { memberId } })
      if (error) {
        throw new Error(error)
      }
      setGroupsList((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            const updatedMembers = (g.group_members ?? []).filter(
              (m) => m.id !== memberId
            )
            return {
              ...g,
              group_members: updatedMembers,
              group_member: updatedMembers,
            }
          }
          return g
        })
      )
      showNotification("Group member removed successfully.")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to remove group member.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Deletes a group challenge using server action and updates local state.
   *
   * PARAMETERS:
   * - groupChallengeId (string): Primary key ID of the group challenge.
   * - groupId (string): Associated group ID.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleDeleteChallenge = async (groupChallengeId: string, groupId: string): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await runGroupChallengeAction({ type: 'deleteGroupChallengeById', payload: { id: groupChallengeId } })
      if (error) {
        throw new Error(error)
      }
      setGroupsList((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            const updatedChallenges = (
              g.group_challenge ||
              []
            ).filter((c) => c.id !== groupChallengeId)
            return {
              ...g,
              group_challenges: updatedChallenges,
              group_challenge: updatedChallenges,
            }
          }
          return g
        })
      )
      showNotification("Group challenge deleted successfully.")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to delete group challenge.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  // 1. Filter groups by search query (name/description) and event
  const filteredGroups = groupsList
    .filter((group) => {
      const query = searchQuery.toLowerCase()
      const name = group.group_name?.toLowerCase() ?? ""
      const desc = group.short_description?.toLowerCase() ?? ""
      return name.includes(query) || desc.includes(query)
    })
    .filter((group) => {
      if (eventFilter === "") return true
      return group.events?.title === eventFilter
    })

  // 2. Sort groups by created_at
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
  })

  // 3. Paginate sorted groups
  const totalPages = Math.ceil(sortedGroups.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedGroups = sortedGroups.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  /**
   * BEHAVIORAL MECHANISM:
   * Handles pagination page navigation.
   *
   * PARAMETERS:
   * - page (number): Target page number.
   *
   * RETURNS:
   * - void
   */
  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 select-text">
      {/* Back button */}
      <BackButton />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
        <div className="flex gap-4 items-stretch">
          <div className="w-[3px] bg-[#00e0b3]" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest">
              SYSTEM_PORTAL // GROUP_CONTROLLER
            </span>
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              GROUP_MANAGEMENT
            </h1>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [GROUP_NODE_ACTIVE]
        </div>
      </div>

      {/* Filters Area Component */}
      <GroupFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        uniqueEvents={uniqueEvents}
        setCurrentPage={setCurrentPage}
      />

      {/* Groups Table Component */}
      <GroupTable
        paginatedGroups={paginatedGroups}
        startIndex={startIndex}
        expandedGroupId={expandedGroupId}
        toggleExpandGroup={toggleExpandGroup}
        handleRemoveMember={handleRemoveMember}
        handleDeleteChallenge={handleDeleteChallenge}
        totalGroupsCount={sortedGroups.length}
      />

      {/* Pagination helper */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
