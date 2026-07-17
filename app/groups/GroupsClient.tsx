'use client'

import { UnifiedGroup } from "@/app/types/group"
import GroupsList from "@/app/components/groups/GroupsList"

interface GroupsClientProps {
  groupsWithEvents: Array<UnifiedGroup>
}

/**
 * PURPOSE:
 * Client Component that acts as the coordinator for the User's Registered Groups directory.
 * It renders the registry header and delegates list rendering and pagination to the shared
 * GroupsList component.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/groups/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - groupsWithEvents (Array<UnifiedGroup>, Required): List of registered groups the user participates in.
 */
export default function GroupsClient({ groupsWithEvents }: GroupsClientProps) {
  return (
    <div className="w-full flex flex-col gap-8 min-h-screen">
      {/* Dashboard Title Header */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-6">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#83958d] uppercase tracking-wider">
          <span className="px-1.5 py-0.5 border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm font-bold text-[8px]">
            CLUSTER OVERVIEW
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase leading-tight font-mono text-[#e8e1df]">
          Your Registered <span className="text-[#00e0b3]">Groups</span>
        </h1>

        <p className="text-xs font-mono text-[#83958d] leading-relaxed">
          Operational log of registered student nodes and associated contest event parameters.
        </p>
      </div>

      {/* Grid wrapper for generic groups, no filters needed, actions navigate to group details */}
      <GroupsList groups={groupsWithEvents} actionType="group" />
    </div>
  )
}