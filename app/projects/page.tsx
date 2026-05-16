import Link from "next/link"
import { getAllEvents } from "../actions/events"
import { getAllProjectsBasedOnStatus } from "../actions/projects";
import ProjectsClient from "./ProjectsClient";
import { PROJECT_STATUS } from "../types/enum";
const Home = async () => {
    const { data: projects, error } = await getAllProjectsBasedOnStatus({ status: PROJECT_STATUS.ACCEPTED, ascending: false });

    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Our Excellent Student Projects</div>
                <ProjectsClient projects={projects ?? []} />
            </div>
        </div>
    )
}

export default Home