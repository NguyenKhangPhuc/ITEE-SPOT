import { Suspense } from "react"
import { getAllEvents } from "../actions/events/get/getAllEvents"
import { getAllProjectsBasedOnStatus } from "../actions/projects/get/getAllProjectsBasedOnStatus"
import ProjectsClient from "./ProjectsClient"
import ProjectsArchiveSkeleton from "./components/ProjectsArchiveSkeleton"
import { PROJECT_STATUS } from "../types/enum"

/**
 * Async Server Component responsible for fetching projects and events in parallel using Promise.all.
 * Rendered inside Suspense to stream HTML without delaying the page outer shell.
 */
async function AsyncProjectsGallery() {
  const [projectsRes, eventsRes] = await Promise.all([
    getAllProjectsBasedOnStatus({ status: PROJECT_STATUS.ACCEPTED, ascending: false }),
    getAllEvents(),
  ])

  if (projectsRes.error) {
    return <div className="w-full flex items-center justify-center text-red-500">Something went wrong: {String(projectsRes.error)}</div>
  }

  if (eventsRes.error) {
    const errorMsg = typeof eventsRes.error === "object" && eventsRes.error && "message" in eventsRes.error
      ? String(eventsRes.error.message)
      : String(eventsRes.error)
    return <div className="w-full flex items-center justify-center text-red-500">Something went wrong: {errorMsg}</div>
  }

  return <ProjectsClient projects={projectsRes.data ?? []} events={eventsRes.data ?? []} />
}

export default function ProjectsPage() {
  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24 flex flex-col gap-6">
        <Suspense fallback={<ProjectsArchiveSkeleton />}>
          <AsyncProjectsGallery />
        </Suspense>
      </div>
    </div>
  )
}