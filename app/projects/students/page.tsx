/**
 * PURPOSE:
 * Server Component representing the Student Projects Management page.
 * Fetches the user session and user groups, and renders the StudentManagementClient dashboard.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/projects/students/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import StudentManagementClient from "./StudentsManagementClient"
import { getUserGroups } from "@/app/actions/groups/get/getUserGroups"
import { getUser } from "@/app/actions/authentication/get/getUser"

export default async function Home() {
  const { data: groupsWithOtherInfo, error } = await getUserGroups()
  const { data: user, error: userError } = await getUser()

  if (userError) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-red-500 flex items-center justify-center font-mono select-none">
        [!] AUTHENTICATION_ERROR: {userError.message}
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-red-500 flex items-center justify-center font-mono select-none">
        [!] REGISTRY_ERROR: {error.message}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <StudentManagementClient
          groupsWithEvents={groupsWithOtherInfo ?? []}
          userId={user.user!.id}
        />
      </div>
    </div>
  )
}