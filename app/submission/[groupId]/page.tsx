import { getUser } from "@/app/actions/authentication/get/getUser"
import { getEventChallenges } from "@/app/actions/event_challenges/get/getEventChallenges"
import { getGroupChallenges } from "@/app/actions/group_challenge/get/getGroupChallenges"
import SubmissionClient from "./SubmissionClient"
import { EventChallenge } from "@/app/types/event_challenges"

interface PageProps {
  params: Promise<{ groupId: string }>
}

/**
 * PURPOSE:
 * Server Component that acts as the entry point for the challenge submission dashboard.
 * It resolves the group ID, queries the challenges registered by the group, queries all
 * challenges available in the parent event (to identify locked challenges), and delegates
 * rendering to the client orchestrator component.
 *
 * CONTEXT/PARENT FILE:
 * Next.js dynamic route at 'app/submission/[groupId]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ groupId: string }>, Required): Next.js dynamic route parameters.
 */
export default async function SubmissionPage({ params }: PageProps) {
  const { groupId } = await params

  // 1. Fetch the challenges registered by this group
  const { data: groupChallenges, error: groupError } = await getGroupChallenges({ groupId })
  if (groupError || !groupChallenges) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {groupError?.message ?? "Group challenges not found."}
      </div>
    )
  }

  // 2. Resolve the parent event ID to load all challenges (including unselected/locked ones)
  const eventId = groupChallenges?.[0]?.event_id
  let allEventChallenges: EventChallenge[] = []

  if (eventId) {
    const { data: eventChallengesData, error: eventChallengesError } = await getEventChallenges(eventId)
    if (!eventChallengesError && eventChallengesData) {
      allEventChallenges = eventChallengesData
    }
  }

  // Fallback to only registered challenges if event lookup fails
  if (allEventChallenges.length === 0) {
    allEventChallenges = groupChallenges.map((gc) => gc.event_challenges).filter(Boolean) as EventChallenge[]
  }

  return (
    <SubmissionClient
      groupChallenges={groupChallenges}
      eventChallenges={allEventChallenges}
      group_id={groupId}
    />
  )
}