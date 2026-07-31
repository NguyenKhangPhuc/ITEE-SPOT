import { getUser } from "@/app/actions/authentication/get/getUser"
import { getSingleGroup } from "@/app/actions/groups"
import { getPendingGroupInvitationsById } from "@/app/actions/invitations"
import SingleGroupClient from "./SingleGroupClient"

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * PURPOSE:
 * Server Component that acts as the entry point for the single group details configuration page.
 * It resolves the group ID from route parameters, queries group info, fetches the user session,
 * retrieves pending invitations, and renders the client orchestrator component.
 *
 * CONTEXT/PARENT FILE:
 * Next.js dynamic route at 'app/groups/[id]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Next.js dynamic path parameters.
 */
export default async function SingleGroupPage({ params }: PageProps) {
  const { id } = await params

  // Fetch group metadata
  const { data: groupInfo, error: groupError } = await getSingleGroup({ groupId: id })
  if (groupError || !groupInfo) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {groupError?.message ?? "Group details not found."}
      </div>
    )
  }

  // Fetch current user session
  const { data: user, error: userError } = await getUser()
  if (userError || !user?.user) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {userError?.message ?? "Authentication required."}
      </div>
    )
  }

  // Fetch pending invitations server-side to pass as props
  const { data: pendingInvitations, error: inviteError } = await getPendingGroupInvitationsById(id)
  if (inviteError) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {inviteError}
      </div>
    )
  }

  return (
    <SingleGroupClient
      groupInfo={groupInfo}
      currentUser={user.user}
      pendingInvitations={pendingInvitations ?? []}
    />
  )
}