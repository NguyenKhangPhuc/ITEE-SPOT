import { Suspense } from "react"
import HeroSection from "./components/home/HeroSection"
import TeamSection from "./components/home/TeamSection"
import CTASection from "./components/home/CTASection"
import PastProjectsSection from "./components/home/PastProjectsSection"
import ProjectsSkeleton from "./components/home/ProjectsSkeleton"
import { getAllProjectsBasedOnStatus } from "./actions/projects/get/getAllProjectsBasedOnStatus"
import { ProjectsSummaryExtended } from "./types/projects"
import { PROJECT_STATUS } from "./types/enum"

/**
 * Async Server Component responsible for fetching project data and rendering PastProjectsSection.
 * Wrapped in Suspense to allow streaming HTML rendering without blocking the initial page shell.
 */
async function ProjectsSectionServer() {
  let initialProjects: ProjectsSummaryExtended[] | null = null
  try {
    const { data } = await getAllProjectsBasedOnStatus({
      status: PROJECT_STATUS.ACCEPTED,
      ascending: true,
    })
    if (data) {
      initialProjects = data as unknown as ProjectsSummaryExtended[]
    }
  } catch (error) {
    console.error("Failed to load projects on server:", error)
  }

  return <PastProjectsSection projects={initialProjects} />
}

/**
 * PURPOSE:
 * Server entrypoint page for the Home route.
 * Renders HeroSection, TeamSection, and CTASection immediately, while streaming the
 * PastProjectsSection asynchronously via Suspense for instant TTFB & FCP.
 */
export default function Home() {
  return (
    <div className="w-full bg-[#151312] text-[#e8e1df] font-montserrat overflow-x-hidden">
      <HeroSection />
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSectionServer />
      </Suspense>
      <TeamSection />
      <CTASection />
    </div>
  )
}
