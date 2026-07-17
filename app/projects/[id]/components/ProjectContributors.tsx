/**
 * PURPOSE:
 * Renders the project contributors / team members grid section. Clicking a member's card
 * navigates to their profile page, while social links ([GITHUB], [LINKEDIN]) open their profiles in new tabs.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/projects/[id]/SingleProjectClient.tsx' to simplify the team presentation block.
 *
 * INPUTS / PARAMETERS:
 * - members (Array<{ id: string; profiles: ProfileInsert | null }> | null, Required): List of group member profiles.
 */

'use client'

import { useRouter } from "next/navigation"
import { ProfileInsert } from "../../../types/profile"
import { tw } from "@/app/constants/design-tokens"

interface MemberNode {
  id: string
  profiles: ProfileInsert | null
}

interface ProjectContributorsProps {
  members: MemberNode[] | null
}

export default function ProjectContributors({ members }: ProjectContributorsProps) {
  const router = useRouter()

  /**
   * BEHAVIORAL MECHANISM:
   * Handles user click on a member's card. Programmatically pushes the route to the student profile page.
   *
   * PARAMETERS:
   * - profileId (string | undefined): Unique profile identifier.
   *
   * RETURNS:
   * - void
   */
  const handleCardClick = (profileId: string | undefined) => {
    if (profileId) {
      router.push(`/student/${profileId}`)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * The component renders a responsive grid of card elements. Clicking on a card triggers handleCardClick
   * to navigate to the student profile. It stops click propagation for GitHub and LinkedIn anchor links,
   * permitting external opening in new tabs without firing the parent click event.
   *
   * PARAMETERS:
   * - props (ProjectContributorsProps): Props containing the list of group members.
   *
   * RETURNS:
   * - React.JSX.Element: The project contributors grid.
   */
  if (!members || members.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#e8e1df] mb-6">
        Project Contributors
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => handleCardClick(member.profiles?.id)}
            className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-4 hover:border-[#00e0b3]/20 transition-colors duration-300 flex gap-4 items-center cursor-pointer`}
          >
            {/* Profile Avatar Placeholder */}
            <div className="w-10 h-10 rounded-sm bg-[#151312] border border-white/5 flex items-center justify-center shrink-0 select-none">
              <span className="material-symbols-outlined text-lg text-[#00e0b3]">person</span>
            </div>

            {/* Member Details */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-mono font-bold text-[#e8e1df] hover:text-[#00e0b3] transition-colors uppercase truncate">
                {member.profiles?.full_name || "No Name"}
              </span>
              <span className="text-[9px] font-mono text-[#83958d] uppercase mt-0.5 truncate">
                {member.profiles?.university || "University of Oulu"} · {member.profiles?.degree || "Student"} {member.profiles?.year ? `(Yr ${member.profiles.year})` : ""}
              </span>
              <span className="text-[9px] font-mono text-[#00e0b3] mt-0.5 truncate">
                {member.profiles?.email}
              </span>

              {/* Social/GitHub/LinkedIn Actions */}
              <div className="flex gap-3 mt-1.5 select-none">
                {member.profiles?.github && (
                  <a
                    href={member.profiles.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#83958d] hover:text-[#00e0b3] transition-colors text-[9px] font-mono uppercase tracking-widest font-bold"
                  >
                    [GITHUB]
                  </a>
                )}
                {member.profiles?.linkedIn && (
                  <a
                    href={member.profiles.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#83958d] hover:text-[#00e0b3] transition-colors text-[9px] font-mono uppercase tracking-widest font-bold"
                  >
                    [LINKEDIN]
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
