'use client'

import HeroSection from "./components/home/HeroSection"
import PastProjectsSection from "./components/home/PastProjectsSection"
import TeamSection from "./components/home/TeamSection"
import CTASection from "./components/home/CTASection"
import { ProjectsSummaryExtended } from "./types/projects"

/**
 * PURPOSE:
 * This is the client wrapper page component for the Home layout. It aggregates and renders
 * the decomposed sub-sections of the main landing page, passing active state data.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/page.tsx' to simplify structure and separate server data fetching
 * from client-side interactive rendering.
 *
 * INPUTS / PARAMETERS:
 * - initialProjects (ProjectsSummaryExtended[] | null, Required): The database projects retrieved on the server.
 */
export default function HomePage({ initialProjects }: { initialProjects: ProjectsSummaryExtended[] | null }) {
  return (
    <div className="w-full bg-[#151312] text-[#e8e1df] font-montserrat overflow-x-hidden">
      <HeroSection />
      <PastProjectsSection projects={initialProjects} />
      <TeamSection />
      <CTASection />
    </div>
  )
}
