import { getAllEvents } from "../actions/events/get/getAllEvents"
import { getAllProjectsBasedOnStatus } from "../actions/projects";
import ProjectsClient from "./ProjectsClient";
import { PROJECT_STATUS } from "../types/enum";
const Home = async () => {
    const { data: projects, error } = await getAllProjectsBasedOnStatus({ status: PROJECT_STATUS.ACCEPTED, ascending: false });

    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error}</div>;
    }

    const { data: allEvents, error: eventsError } = await getAllEvents()

    if (eventsError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error}</div>;
    }

    return (
        <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono">
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-24 flex flex-col gap-6">
                <ProjectsClient projects={projects ?? []} events={allEvents ?? []} />
            </div>
        </div>
    )
}

export default Home