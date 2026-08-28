/**
 * PURPOSE:
 * Client Component acting as the controller dashboard for User Management.
 * Manages states for filters, search queries, pagination, and sorting.
 * Renders the decomposed UserFilters and UserTable child components.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/user-management/page.tsx'.
 * Refactored using 'refactor-skill' guidelines to decompose monolithic structure.
 *
 * INPUTS / PARAMETERS:
 * - profiles (ProfileInsert[], Required): Array of registered profile records.
 */

'use client'

import { useState } from "react"
import { ProfileInsert } from "@/app/types/profile"
import { PROFILE_ROLE, UNIVERSITY, PROGRAMME } from "@/app/types/enum"
import { createClient } from "@/app/utils/supabase/client"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import BackButton from "@/app/components/BackButton"
import Pagination from "@/app/helpers/Pagination"
import UserFilters from "./components/UserFilters"
import UserTable from "./components/UserTable"

interface UserManagementClientProps {
  profiles: Array<ProfileInsert>
}

const ITEMS_PER_PAGE = 20

type SortKey = "name_asc" | "name_desc"

export default function UserManagementClient({ profiles: initialProfiles }: UserManagementClientProps) {
  const supabase = createClient()
  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  const [profiles, setProfiles] = useState<Array<ProfileInsert>>(initialProfiles)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<PROFILE_ROLE | "">("")
  const [uniFilter, setUniFilter] = useState<UNIVERSITY | "">("")
  const [progFilter, setProgFilter] = useState<PROGRAMME | "">("")
  const [sortBy, setSortBy] = useState<SortKey>("name_asc")
  const [currentPage, setCurrentPage] = useState<number>(1)

  /**
   * BEHAVIORAL MECHANISM:
   * Handles updating the user's role directly via Supabase browser client.
   * On success, updates local profiles state.
   *
   * PARAMETERS:
   * - userId (string): The user's database ID.
   * - newRole (PROFILE_ROLE): The target role type.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleRoleChange = async (userId: string, newRole: PROFILE_ROLE): Promise<void> => {
    setIsOpenLoader(true)
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
      if (error) {
        throw new Error(error.message)
      }
      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === userId ? { ...profile, role: newRole } : profile
        )
      )
      showNotification("User role updated successfully.")
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      } else {
        showNotification("Failed to update user role.")
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  // 1. Filter profiles by email/full_name search, role, university, and programme
  const filteredProfiles = profiles
    .filter((profile) => {
      const email = profile.email?.toLowerCase() ?? ""
      const fullName = profile.full_name?.toLowerCase() ?? ""
      const query = searchQuery.toLowerCase()
      return email.includes(query) || fullName.includes(query)
    })
    .filter((profile) => {
      if (roleFilter === "") return true
      return profile.role === roleFilter
    })
    .filter((profile) => {
      if (uniFilter === "") return true
      return profile.university === uniFilter
    })
    .filter((profile) => {
      if (progFilter === "") return true
      return profile.programme === progFilter
    })

  // 2. Sort profiles by chosen criteria (Full Name ASC / DESC)
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    const valA = a.full_name?.toLowerCase() ?? ""
    const valB = b.full_name?.toLowerCase() ?? ""

    if (sortBy === "name_asc") {
      return valA.localeCompare(valB)
    } else {
      return valB.localeCompare(valA)
    }
  })

  // 3. Paginate filtered/sorted profiles (exactly 20 per page)
  const totalPages = Math.ceil(sortedProfiles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProfiles = sortedProfiles.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  /**
   * BEHAVIORAL MECHANISM:
   * Handles page changes, verifying range validity.
   *
   * PARAMETERS:
   * - page (number): Target page choice.
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
              SYSTEM_PORTAL // MEMBER_CONTROLLER
            </span>
            <h1 className="text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
              USER_MANAGEMENT
            </h1>
          </div>
        </div>

        <div className="text-[8px] font-mono text-[#00e0b3] border border-[#00e0b3]/20 bg-[#00e0b3]/5 px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none">
          [CONTROL_NODE_ACTIVE]
        </div>
      </div>

      {/* Filters Area component */}
      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        uniFilter={uniFilter}
        setUniFilter={setUniFilter}
        progFilter={progFilter}
        setProgFilter={setProgFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setCurrentPage={setCurrentPage}
      />

      {/* Users Database Table section */}
      <div className="flex flex-col gap-4">
        {/* Table Metrics */}
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8e1df] uppercase tracking-wider">
            <div className="w-[3px] h-3 bg-[#00e0b3]" />
            <span>01_MEMBER_REGISTRY_DATABASE</span>
          </div>
          <span className="font-mono text-[9px] text-[#83958d]">
            TOTAL_MEMBERS: {sortedProfiles.length}
          </span>
        </div>

        {/* User Table component */}
        <UserTable
          paginatedProfiles={paginatedProfiles}
          startIndex={startIndex}
          handleRoleChange={handleRoleChange}
        />

        {/* Dynamic Pagination helper */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
