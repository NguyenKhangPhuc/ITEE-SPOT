/**
 * PURPOSE:
 * Server Component representing the Event Grading Results page.
 * It fetches the event criteria, authenticated user, event metadata,
 * and calls getSubmissionFinalScores to retrieve the evaluated grades.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/events/[id]/grade/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - params (Promise<{ id: string }>, Required): Next.js router parameters containing event ID.
 */

import { getUser } from "@/app/actions/authentication/get/getUser"
import { getEventCriteriaById } from "@/app/actions/event_criteria/get/getEventCriteriaById"
import { getSingleEvent } from "@/app/actions/events/get/getSingleEvent"
import { getSubmissionFinalScores } from "@/app/actions/submission_final_score"
import EventResultClient from "./EventResultClient"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Home({ params }: PageProps) {
  const { id } = await params
  const { data: event, error: eventError } = await getSingleEvent(id)

  if (eventError) {
    return (
      <div className="w-full flex items-center justify-center text-red-500 min-h-screen bg-[#151312]">
        Something went wrong: {eventError.message}
      </div>
    )
  }

  const { data: user, error: userError } = await getUser()
  if (userError) {
    return (
      <div className="w-full flex items-center justify-center text-red-500 min-h-screen bg-[#151312]">
        Something went wrong: {userError.message}
      </div>
    )
  }

  const { data: eventCriteria, error: criteriaError } = await getEventCriteriaById(id)
  if (criteriaError) {
    return (
      <div className="w-full flex items-center justify-center text-red-500 min-h-screen bg-[#151312]">
        Something went wrong: {criteriaError?.message}
      </div>
    )
  }

  const { data: scores, error: scoresError } = await getSubmissionFinalScores(id)
  if (scoresError) {
    return (
      <div className="w-full flex items-center justify-center text-red-500 min-h-screen bg-[#151312]">
        Something went wrong: {scoresError}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
      <div className="max-w-7xl mx-auto flex flex-col">
        <EventResultClient
          event={event!}
          eventCriteria={eventCriteria ?? []}
          scores={scores ?? []}
          eventId={id}
          user={user.user!}
        />
      </div>
    </div>
  )
}