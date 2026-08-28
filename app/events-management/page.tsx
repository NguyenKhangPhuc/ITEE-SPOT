/**
 * PURPOSE:
 * Server Component for the Admin Event Management portal route.
 * Fetches all event records from database using Server Actions and mounts EventManagementClient inside a dark terminal layout.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events-management/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { getAllEvents } from "@/app/actions/events/get/getAllEvents"
import { updateEventStatus } from "@/app/actions/events/put/updateEventStatus"
import { updateEventRegistrationStatus } from "@/app/actions/events/put/updateEventRegistrationStatus"
import EventManagementClient from "./EventManagementClient"

export default async function Home() {
  const { data: events } = await getAllEvents()

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono flex flex-col p-6 py-12 select-none">
      <div className="max-w-7xl mx-auto w-full">
        <EventManagementClient
          events={events || []}
          actions={{
            updateEventStatus,
            updateEventRegistrationStatus,
          }}
        />
      </div>
    </div>
  )
}
