/**
 * PURPOSE:
 * Server Component representing the Group Management page.
 * Fetches all user groups along with their event, member, and challenge details,
 * and renders GroupManagementClient.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/group_management/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { getAllGroups } from "@/app/actions/groups"
import GroupManagementClient from "./GroupManagementClient"
import { AdminGroups } from "@/app/types/group"

export default async function Home() {
    const { data: groups, error } = await getAllGroups()

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
                <GroupManagementClient groups={groups ?? []} />
            </div>
        </div>
    )
}
