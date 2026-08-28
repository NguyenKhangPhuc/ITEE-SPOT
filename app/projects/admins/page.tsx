/**
 * PURPOSE:
 * Server Component representing the Admin Projects Management page.
 * Fetches user profile, event specifications, and user group configurations,
 * and renders the ProjectsAdminClient dashboard wrapper.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/projects/admins/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import ProjectsAdminClient from "./ProjectsAdminClient"
import { getAllEventsWithGroupAndAward } from "@/app/actions/events/get/getAllEventsWithGroupAndAward"
import { getUser } from "@/app/actions/authentication/get/getUser"

export default async function Home() {
  const { data: user, error: userError } = await getUser()
  const { data: eventsWithGroupsAndAward, error: eventsError } = await getAllEventsWithGroupAndAward()

  if (userError) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-red-500 flex items-center justify-center font-mono select-none">
        [!] AUTHENTICATION_ERROR: {userError.message}
      </div>
    )
  }

  if (eventsError) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-red-500 flex items-center justify-center font-mono select-none">
        [!] SYSTEM_ERROR: Failed to fetch event parameters.
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <ProjectsAdminClient
          eventsWithGroupsAndAwards={eventsWithGroupsAndAward ?? []}
        />
      </div>
    </div>
  )
}