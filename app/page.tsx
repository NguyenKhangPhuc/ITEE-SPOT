import HomePage from "./HomePage"
import { getAllProjectsBasedOnStatus } from "./actions/projects"
import { ProjectsSummaryExtended } from "./types/projects"
import { PROJECT_STATUS } from "./types/enum"

/**
 * PURPOSE:
 * This is the server entrypoint page for the Home route. It fetches accepted spotlight projects
 * from the database server-side and passes them as props to the client-side HomePage component.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from a monolithic page.tsx layout to support server-side rendering of project data
 * and separation of interactive client components.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default async function Home() {
  /**
   * BEHAVIORAL MECHANISM:
   * During server-side rendering, this function invokes the `getAllProjectsBasedOnStatus` server action
   * with accepted status to query database projects. The queried data is typed and forwarded as a prop
   * to the child `HomePage` client component. If database operations fail, null is passed to ensure
   * page rendering handles it gracefully.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * A JSX element rendering the client HomePage with server-fetched project data.
   */
  let initialProjects: ProjectsSummaryExtended[] | null = null
  try {
    const { data } = await getAllProjectsBasedOnStatus({ status: PROJECT_STATUS.ACCEPTED, ascending: true })
    if (data) {
      initialProjects = data as unknown as ProjectsSummaryExtended[]
    }
  } catch (error) {
    console.error("Failed to load projects on server:", error)
  }

  return <HomePage initialProjects={initialProjects} />
}
