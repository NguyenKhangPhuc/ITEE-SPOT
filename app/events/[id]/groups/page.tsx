import { getSingleEvent } from "@/app/actions/events/get/getSingleEvent"
import { getEventGroups } from "@/app/actions/groups/get/getEventGroups"
import EventGroupsClient from "./EventGroupsClient"
import BackButton from "@/app/components/BackButton"

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * PURPOSE:
 * Server Component that acts as the entry point for the Event Groups Registry page.
 * It resolves the event ID, queries the event and group details, and delegates rendering to EventGroupsClient.
 *
 * CONTEXT/PARENT FILE:
 * Dynamic route at 'app/events/[id]/groups/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Dynamic route parameters.
 */
export default async function EventGroupsPage({ params }: PageProps) {
  const { id } = await params

  // 1. Query parent event details
  const { data: event, error: eventError } = await getSingleEvent(id)
  if (eventError || !event) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {eventError?.message ?? "Event details not found."}
      </div>
    )
  }

  // 2. Query event's registered groups list
  const { data: groups, error: groupsError } = await getEventGroups(id)
  if (groupsError) {
    return (
      <div className="w-full min-h-screen bg-[#151312] flex items-center justify-center font-mono text-red-400 text-sm">
        {groupsError.message}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24 flex flex-col gap-6">
        <BackButton />
        <EventGroupsClient event={event} eventGroups={groups} />
      </div>
    </div>
  )
}