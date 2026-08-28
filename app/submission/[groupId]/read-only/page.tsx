import { getUser } from "@/app/actions/authentication/get/getUser"
import { getSubmissionByGroupId } from "@/app/actions/submissions/get/getSubmissionByGroupId"
import { getUserProfile } from "@/app/actions/profiles/get/getUserProfile"
import { getSingleGroup } from "@/app/actions/groups/get/getSingleGroup"
import { getSubmissionRatingById, createSubmissionRating } from "@/app/actions/submission_ratings"
import { getSubmissionFeedBackByUserIdAndSubmissionId } from "@/app/actions/submission_feedback/get/getSubmissionFeedBackByUserIdAndSubmissionId"
import { updateSubmissionFeedback } from "@/app/actions/submission_feedback/put/updateSubmissionFeedback"
import { getPublicFileURL } from "@/app/actions/file_url"
import ReadOnlySubmissionClient from "./ReadOnlySubmissionClient"

interface PageProps {
  params: Promise<{ groupId: string }>
}

/**
 * PURPOSE:
 * Server Component that acts as the entry point for the read-only submission details page.
 * It resolves the group ID, queries the group's submissions, queries the group details and parent event,
 * queries the authenticated user profile, and delegates rendering to ReadOnlySubmissionClient.
 *
 * CONTEXT/PARENT FILE:
 * Next.js dynamic route at 'app/submission/[groupId]/read-only/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ groupId: string }>, Required): Next.js dynamic route parameters.
 */
export default async function ReadOnlySubmissionPage({ params }: PageProps) {
  const { groupId } = await params

  // 1. Fetch group submissions
  const { data: submissions, error: subError } = await getSubmissionByGroupId({ groupId })
  if (subError || !submissions) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {subError?.message ?? "Submissions not found."}
      </div>
    )
  }

  // 2. Fetch group and event metadata
  const { data: groupInfo } = await getSingleGroup({ groupId })

  // 3. Fetch authenticated user session
  const { data: userData, error: userError } = await getUser()
  if (userError || !userData?.user) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {userError?.message ?? "Authentication required."}
      </div>
    )
  }

  // 4. Fetch user profile role and information
  const { data: userProfile, error: profileError } = await getUserProfile(userData.user.id)
  if (profileError || !userProfile) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {profileError?.message ?? "Profile metadata not found."}
      </div>
    )
  }

  return (
    <ReadOnlySubmissionClient
      groupSubmissions={submissions}
      user={userProfile}
      groupInfo={groupInfo}
      actions={{
        getSubmissionRatingById,
        getSubmissionFeedBackByUserIdAndSubmissionId,
        getPublicFileURL,
        createSubmissionRating,
        updateSubmissionFeedback,
      }}
    />
  )
}