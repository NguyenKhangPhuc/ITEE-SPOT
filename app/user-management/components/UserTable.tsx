/**
 * PURPOSE:
 * Renders the tabular display of user profile details for administrators.
 * Displays user indices, names, email addresses, universities, programmes,
 * and an inline selector to dynamically modify system-level roles.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/user-management/UserManagementClient.tsx' to modularize table rendering.
 *
 * INPUTS / PARAMETERS:
 * - paginatedProfiles (ProfileInsert[], Required): User profile data records segment for the active page.
 * - startIndex (number, Required): Sequential count offset index based on active pagination page.
 * - handleRoleChange ((userId: string, newRole: PROFILE_ROLE) => Promise<void>, Required): Callback function to update user roles.
 */

'use client'

import React from "react"
import { AnimatePresence } from "framer-motion"
import { ProfileInsert } from "@/app/types/profile"
import { PROFILE_ROLE } from "@/app/types/enum"
import { tw } from "@/app/constants/design-tokens"

interface UserTableProps {
  paginatedProfiles: Array<ProfileInsert>
  startIndex: number
  handleRoleChange: (userId: string, newRole: PROFILE_ROLE) => Promise<void>
}

export default function UserTable({
  paginatedProfiles,
  startIndex,
  handleRoleChange,
}: UserTableProps) {

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-x-auto`}>
      <table className="w-full border-collapse font-mono text-[10px] text-[#b9cbc2] text-left min-w-[900px]">
        <thead>
          <tr className="border-b border-white/5 bg-[#151312] text-[#83958d] select-none text-[8.5px] uppercase tracking-wider">
            <th className="p-4 font-bold text-center w-12">NO</th>
            <th className="p-4 font-bold">FULL_NAME</th>
            <th className="p-4 font-bold">EMAIL_ADDRESS</th>
            <th className="p-4 font-bold">UNIVERSITY</th>
            <th className="p-4 font-bold">PROGRAMME_MAJOR</th>
            <th className="p-4 font-bold text-center w-36">SYSTEM_ROLE</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {paginatedProfiles.length > 0 ? (
              paginatedProfiles.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors"
                >
                  <td className="p-4 text-center font-bold text-[#83958d]">
                    {String(startIndex + index + 1).padStart(3, "0")}
                  </td>
                  <td className="p-4 text-[#e8e1df] font-bold whitespace-nowrap">
                    {user.full_name || "UNREGISTERED_NAME"}
                  </td>
                  <td className="p-4 text-[#83958d] whitespace-nowrap">
                    {user.email || "NO_EMAIL_ADDR"}
                  </td>
                  <td className="p-4 whitespace-nowrap uppercase">
                    {user.university || "NOT_SPECIFIED"}
                  </td>
                  <td className="p-4 max-w-[200px] truncate uppercase">
                    {user.programme || "NOT_SPECIFIED"}
                  </td>
                  <td className="p-4 text-center w-36 select-none">
                    <div className="relative flex items-center w-full">
                      <select
                        onChange={(e) =>
                          handleRoleChange(user.id!, e.target.value as PROFILE_ROLE)
                        }
                        value={user.role ?? ""}
                        className="bg-[#151312] text-[#e8e1df] border border-white/5 font-mono text-[9px] p-2 pr-6 rounded-sm outline-none focus:border-[#00e0b3]/50 transition-colors w-full appearance-none cursor-pointer text-center uppercase"
                      >
                        <option value="">NO_ROLE</option>
                        {Object.entries(PROFILE_ROLE).map(([key, val]) => (
                          <option key={key} value={val}>
                            {key.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-2 text-[10px] text-[#83958d] pointer-events-none">
                        keyboard_arrow_down
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center text-[#83958d] select-none">
                  NO USER REGISTRY ENTRIES MATCHING ACTIVE FILTER PARAMETERS
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}
