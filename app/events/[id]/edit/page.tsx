/**
 * PURPOSE:
 * Server Component representing the Edit Event page wrapper.
 * Fetches the event details on the server and mounts the EditEventClient dashboard.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/[id]/edit/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Request URL parameters containing event ID.
 */

import { getSingleEvent } from "@/app/actions/events/get/getSingleEvent"
import { getAwardsByEventId } from "@/app/actions/event_awards/get/getAwardsByEventId"
import EditEventClient from "./EditEventClient"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Home({ params }: PageProps) {
  const { id } = await params
  const { data: event, error: eventError } = await getSingleEvent(id)
  const { data: awards } = await getAwardsByEventId(id)

  if (eventError) {
    return (
      <div className="w-full min-h-screen bg-[#151312] text-red-500 flex items-center justify-center font-mono select-none">
        [!] FAILED_TO_RETRIEVE_REGISTRY: {eventError.message}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <EditEventClient event={event!} awards={awards ?? []} />
      </div>
    </div>
  )
}