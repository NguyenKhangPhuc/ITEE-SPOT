/**
 * PURPOSE:
 * Server Component representing the User Management page.
 * Fetches all registered profiles from the database and renders UserManagementClient.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/user-management/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { getAllUsers } from "@/app/actions/profiles"
import UserManagementClient from "./UserManagementClient"

export default async function Home() {
  const { data: users, error } = await getAllUsers()

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-red-500 flex items-center justify-center font-mono select-none">
        [!] SYSTEM_ERROR: {error}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <UserManagementClient profiles={users ?? []} />
      </div>
    </div>
  )
}
