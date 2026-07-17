'use client'

import { useState } from "react"
import { EventChallenge } from "@/app/types/event_challenges"
import { GroupChallengeRelation } from "@/app/types/group_challenge"
import BackButton from "@/app/components/BackButton"
import SubmissionHeader from "./components/SubmissionHeader"
import ChallengeAccordion from "./components/ChallengeAccordion"

interface SubmissionClientProps {
  groupChallenges: Array<GroupChallengeRelation>
  eventChallenges: Array<EventChallenge>
  group_id: string
}

/**
 * PURPOSE:
 * This component acts as the main client-side coordinator for the challenge submission
 * dashboard. It renders a list of challenge accordions vertically. Clicking an active challenge
 * expands its dropdown submission form, while locked challenges remain collapsed and disabled.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/submission/[groupId]/page.tsx'. Sub-components reside in
 * 'app/submission/[groupId]/components/'.
 *
 * INPUTS / PARAMETERS:
 * - groupChallenges (GroupChallengeRelation[], Required): List of challenges registered by this group.
 * - eventChallenges (EventChallenge[], Required): All possible challenges for the parent event.
 * - group_id (string, Required): The group ID parameter.
 */
export default function SubmissionClient({
  groupChallenges,
  eventChallenges,
  group_id,
}: SubmissionClientProps) {
  // Tracks the index of the currently expanded challenge accordion
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number | null>(null)

  /**
   * BEHAVIORAL MECHANISM:
   * Expands or collapses a challenge accordion by its array index. If the index is
   * already active, clicking again collapses it.
   *
   * PARAMETERS:
   * - index (number): The array index of the clicked challenge.
   *
   * RETURNS:
   * - void
   */
  const handleToggleAccordion = (index: number) => {
    setActiveAccordionIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-montserrat">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">
        {/* Back Navigation */}
        <BackButton />

        {/* System Title Banner */}
        <SubmissionHeader />

        {/* Vertical Accordion List */}
        <div className="flex flex-col gap-4 mt-8">
          {eventChallenges.map((challenge, index) => {
            // Find if this challenge is registered by the group
            const matchingRelation = groupChallenges.find(
              (gc) => gc.challenge_id === challenge.id
            ) ?? null

            return (
              <ChallengeAccordion
                key={challenge.id}
                challenge={challenge}
                groupId={group_id}
                groupChallengeRelation={matchingRelation}
                isOpen={activeAccordionIndex === index}
                onToggle={() => handleToggleAccordion(index)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}