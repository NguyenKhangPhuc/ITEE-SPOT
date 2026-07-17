/**
 * PURPOSE:
 * Renders the top user profile card widget displaying student name, professional title,
 * academic details, search tags, a simulated terminal registry node address,
 * and social anchors (Email, GitHub, LinkedIn).
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/student/[id]/StudentProfileClient.tsx' to display the student details header.
 *
 * INPUTS / PARAMETERS:
 * - user (ProfileInsert, Required): The user profile database row.
 */

'use client'

import Image from "next/image"
import { createClient } from "@/app/utils/supabase/client"
import { handleGetUrl } from "@/app/helpers/FileUrl"
import { ProfileInsert } from "@/app/types/profile"
import { DEGREE } from "@/app/types/enum"
import { tw } from "@/app/constants/design-tokens"
import { useNotification } from "@/app/context/NotificationContext"

interface ProfileHeaderProps {
  user: ProfileInsert
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const supabase = createClient()
  const { showNotification } = useNotification()

  /**
   * BEHAVIORAL MECHANISM:
   * Copies the student email to the clipboard and triggers a toast notification.
   *
   * PARAMETERS:
   * - e (React.MouseEvent): Click event object.
   *
   * RETURNS:
   * - void
   */
  const handleCopyEmail = (e: React.MouseEvent): void => {
    e.preventDefault()
    if (user.email) {
      navigator.clipboard.writeText(user.email)
      showNotification("Copy successfully")
    }
  }

  const degreeLabel: Record<DEGREE, string> = {
    Bachelor: "B.Sc",
    Master: "M.Sc",
    "Ph.D": "Ph.D",
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Dynamically generates short uppercase keyword tags from the user's programme name.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - string[]: Array of keyword tags.
   */
  const getTags = (): string[] => {
    if (!user.programme) return ["NODE_RESEARCH", "ITEE_STUDENT"]
    return user.programme
      .toUpperCase()
      .split(/[\s,./\-_]+/)
      .filter((word) => word.length > 3 && !["AND", "THE", "FOR", "WITH", "INTO", "FROM"].includes(word))
      .slice(0, 3)
  }

  const tags = getTags()

  return (
    <div className={`${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden`}>
      {/* Registry Address Code Overlay (Far Top-Right) */}
      <div className="absolute top-6 right-6 hidden md:flex flex-col items-end font-mono select-none bg-[#151312]/60 border border-white/5 p-3 rounded-sm">
        <span className="text-[8px] text-[#83958d] uppercase tracking-widest">
          REGISTRY NODE
        </span>
        <span className="text-[9px] font-bold text-[#00e0b3] tracking-widest mt-1">
          0x{user.id ? user.id.slice(0, 4).toUpperCase() : "7F22"}_DIV_ADV
        </span>
      </div>

      {/* Left Column: Image Frame & Social Row */}
      <div className="flex flex-col items-center shrink-0 self-center md:self-start">
        <div className="relative w-28 h-28 rounded-sm overflow-hidden border-2 border-[#00e0b3]/30 bg-[#151312] shrink-0">
          {user.avatar_url ? (
            <Image
              src={handleGetUrl(supabase, user.avatar_url)}
              alt={user.full_name || "Avatar"}
              fill
              sizes="112px"
              className="object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#151312] text-[#83958d] select-none font-mono">
              <span className="material-symbols-outlined text-3xl">account_circle</span>
              <span className="text-[7px] tracking-widest uppercase mt-1">
                {user.full_name ? user.full_name.slice(0, 2).toUpperCase() : "NODE"}
              </span>
            </div>
          )}
          {/* Overlay scanning effect */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />
        </div>

        {/* Social Icons row */}
        <div className="flex gap-4 justify-center mt-4 text-[#83958d] select-none items-center">
          {user.email && (
            <button
              onClick={handleCopyEmail}
              title="Copy Email"
              className="hover:text-[#00e0b3] transition-colors cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">mail</span>
            </button>
          )}
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile"
              className="hover:text-[#00e0b3] transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          {user.linkedIn && (
            <a
              href={user.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn Profile"
              className="hover:text-[#00e0b3] transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Right Column: Profile details */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#e8e1df] tracking-tight uppercase leading-tight font-mono">
            {user.full_name || "UNMAPPED_NODE"}
          </h1>
          <p className="text-xs font-mono font-bold text-[#00e0b3] uppercase tracking-wider mt-1">
            {user.job_title || "UNMAPPED_NODE"}
            {user.company_name ? ` @ ${user.company_name}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
          {/* Column 1: Unit & Academic registry */}
          <div className="flex flex-col gap-4">
            {/* Unit Info */}
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest flex items-center gap-1.5 select-none">
                <span className="material-symbols-outlined text-[10px]">hub</span>
                DEPLOYMENT UNIT
              </span>
              <span className="text-xs font-mono text-[#e8e1df] mt-1">
                {user.company_unit || "UNASSIGNED_SECTOR"}
              </span>
            </div>

            {/* Academic Info */}
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest flex items-center gap-1.5 select-none">
                <span className="material-symbols-outlined text-[10px]">school</span>
                ACADEMIC REGISTRY
              </span>
              <p className="text-xs font-mono text-[#b9cbc2] leading-relaxed mt-1">
                {user.degree && degreeLabel[user.degree as DEGREE] && degreeLabel[user.degree as DEGREE]} in {user.programme || "UNASSIGNED_SECTOR"}
                <br />
                {user.university || "UNASSIGNED_SECTOR"},  {user.year || "UNASSIGNED_SECTOR"}
              </p>
            </div>
          </div>

          {/* Column 2: Synopsis description & tags */}
          <div className="flex flex-col justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-widest flex items-center gap-1.5 select-none">
                <span className="material-symbols-outlined text-[10px]">description</span>
                PROFESSIONAL ABSTRACT
              </span>
              <p className="text-xs font-mono text-[#b9cbc2] leading-relaxed mt-1">
                {user.description || "No professional synopsis mapped to this node."}
              </p>
            </div>

            {/* Interest Tags */}
            <div className="flex flex-wrap gap-1.5 select-none">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 border border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3] rounded-sm font-mono text-[7px] font-bold uppercase tracking-widest"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
