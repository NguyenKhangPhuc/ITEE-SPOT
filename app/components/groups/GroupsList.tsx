'use client'

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { UnifiedGroup } from "@/app/types/group"
import Pagination from "@/app/helpers/Pagination"
import { tw } from "@/app/constants/design-tokens"
import { createClient } from "@/app/utils/supabase/client"
import { handleGetUrl } from "@/app/helpers/FileUrl"
import Image from 'next/image'
interface GroupsListProps {
  groups: Array<UnifiedGroup>
  actionType: 'submission' | 'group'
}

/**
 * PURPOSE:
 * Shared presentation component displaying a list of groups in a 2-column grid. It handles
 * client-side pagination (4 groups per page max) using the system Pagination helper, maps
 * core operatives, active challenge tags, and displays a bottom navigation button.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/components/groups/GroupsList.tsx' to be consumed by both EventGroupsClient.tsx
 * and GroupsClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - groups (Array<UnifiedGroup>, Required): The list of groups to render.
 * - actionType ('submission' | 'group', Required): Determines the target route and text of the card action button.
 */
export default function GroupsList({ groups, actionType }: GroupsListProps) {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 4
  const supabase = createClient()

  const totalPages = Math.ceil(groups.length / itemsPerPage)
  const paginatedGroups = groups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {paginatedGroups.map((group, index) => {
            const actionLink =
              actionType === "submission"
                ? `/submission/${group.id}/read-only`
                : `/groups/${group.id}`
            const actionText =
              actionType === "submission" ? "View Group Submission" : "View Your Group"

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm overflow-hidden flex flex-col justify-between hover:border-[#00e0b3]/20 transition-all duration-300 relative group`}
              >
                {/* Poster Cover Banner */}
                <div className="relative w-full h-56 overflow-hidden">
                  {group.poster_path ? (
                    <Image
                      src={handleGetUrl(supabase, group.poster_path)}
                      alt={`${group.group_name || "Group"} Poster`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(rgba(0,224,179,0.03)_1px,transparent_1px)] [background-size:12px_12px] opacity-60">
                      <span className={`text-xs font-mono uppercase tracking-widest ${tw.text.mint}`}>
                        No image
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Top / Header */}
                <div className="p-6 flex flex-col gap-4 relative z-10">
                  <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                    <h3 className="text-base font-mono font-bold text-[#e8e1df] uppercase tracking-wider group-hover:text-white transition-colors">
                      {group.group_name || "Cluster Node"}
                    </h3>
                  </div>

                  {/* Creation Time & Event ID metadata columns */}
                  <div className="grid grid-cols-2 gap-4 font-mono text-[8px] uppercase tracking-widest text-[#83958d]">
                    <div className="flex flex-col gap-0.5">
                      <span>Creation Timestamp</span>
                      <span className="text-[#e8e1df]">
                        {group.created_at
                          ? new Date(group.created_at).toISOString().replace("T", " ").slice(0, 19)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                      <span>Event ID</span>
                      <span className="text-[#00e0b3] font-semibold">{group.events?.title || "N/A"}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-mono text-[#83958d] line-clamp-2 leading-relaxed min-h-[32px] pt-1">
                    {group.short_description || "No project parameters or synopsis mapped to this node."}
                  </p>

                  {/* Core Operatives (Members) */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex items-center gap-2 border-l border-[#00e0b3] pl-2">
                      <span className="text-[8px] font-mono font-bold text-[#00e0b3] uppercase tracking-widest">
                        Core Operatives
                      </span>
                    </div>
                    {group.members.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {group.members.map((m, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xs text-[#83958d]">
                                person
                              </span>
                            </div>
                            <div className="flex flex-col min-w-0 font-mono">
                              <span className="text-[10px] text-[#e8e1df] font-semibold truncate leading-tight">
                                {m.profiles?.full_name || "Operative " + (idx + 1)}
                              </span>
                              <span className="text-[8px] text-[#83958d] truncate leading-none mt-0.5">
                                {m.profiles?.email || "N/A"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[8px] font-mono text-[#83958d] italic">
                        No operatives mapped to this node.
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom / Footer & Actions */}
                <div className="px-6 pb-6 pt-2 flex flex-col gap-4 relative z-10">
                  {/* Challenge Badge Tags */}
                  {group.challenges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                      {group.challenges.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 border border-[#00e0b3]/30 bg-[#00e0b3]/10 text-[#00e0b3] rounded-sm font-mono text-[7px] font-bold uppercase tracking-wider"
                        >
                          {c.event_challenges?.title?.toUpperCase() ?? "N/A"}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Navigation Link Button */}
                  <Link
                    href={actionLink}
                    className="w-full flex items-center justify-center gap-2 border border-white/10 bg-[#151312] hover:bg-[#00e0b3]/5 hover:border-[#00e0b3]/40 text-[#e8e1df] hover:text-[#00e0b3] font-mono text-[10px] uppercase font-bold tracking-widest py-3 transition-all duration-300 rounded-sm cursor-pointer"
                  >
                    <span>{actionText}</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
