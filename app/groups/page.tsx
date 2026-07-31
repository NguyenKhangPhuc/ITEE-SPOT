import { getUserGroups } from "../actions/groups/get/getUserGroups"
import GroupsClient from "./GroupsClient"
import BackButton from "@/app/components/BackButton"

/**
 * PURPOSE:
 * Server Component that acts as the entry point for the User's Registered Groups dashboard.
 * It queries all groups associated with the active student session and delegates rendering to GroupsClient.
 *
 * CONTEXT/PARENT FILE:
 * Entry route at 'app/groups/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default async function GroupsPage() {
  const { data: groups, error } = await getUserGroups()
  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {error.message}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24 flex flex-col gap-6">
        <BackButton />
        <GroupsClient groupsWithEvents={groups ?? []} />
      </div>
    </div>
  )
}