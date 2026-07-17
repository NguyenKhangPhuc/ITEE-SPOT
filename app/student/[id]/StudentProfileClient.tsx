/**
 * PURPOSE:
 * Client Component representing the student profile details page.
 * It mounts the refactored ProfileHeader layout, displays the list of project contributions
 * in a responsive 3-column grid of ProjectShowcaseCard items, and handles empty state presentation.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/student/[id]/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - user (ProfileInsert, Required): The user database profile row.
 * - userProjects (ProjectsSummaryExtended[], Required): Array of projects submitted by the user.
 */

'use client'

import { ProfileInsert } from "@/app/types/profile"
import { ProjectsSummaryExtended } from "@/app/types/projects"
import BackButton from "@/app/components/BackButton"
import ProfileHeader from "./components/ProfileHeader"
import ProjectShowcaseCard from "./components/ProjectShowcaseCard"
import { tw } from "@/app/constants/design-tokens"

interface StudentProfileClientProps {
  user: ProfileInsert
  userProjects: ProjectsSummaryExtended[]
}

export default function StudentProfileClient({ user, userProjects }: StudentProfileClientProps) {
  return (
    <div className="w-full flex flex-col gap-8 min-h-screen">
      {/* Back navigation button */}
      <BackButton />

      {/* Profile Details Header Block */}
      <ProfileHeader user={user} />

      {/* Project Contributions Section */}
      <div className="flex flex-col gap-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 select-none">
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#e8e1df] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#00e0b3]">account_tree</span>
            <span>Project Contributions</span>
          </h2>
          <span className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest">
            Total Entries: {String(userProjects.length).padStart(2, '0')}
          </span>
        </div>

        {/* Showcase Grid */}
        {userProjects && userProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project, idx) => (
              <ProjectShowcaseCard
                key={project.id || idx}
                project={project}
                index={idx}
              />
            ))}
          </div>
        ) : (
          /* Empty Showcase State */
          <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-12 text-center flex flex-col items-center justify-center`}>
            <span className="material-symbols-outlined text-3xl text-[#83958d] select-none">
              folder_open
            </span>
            <p className="text-xs font-mono text-[#83958d] uppercase tracking-widest mt-2 select-none">
              No active project registry records mapped to this node.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
