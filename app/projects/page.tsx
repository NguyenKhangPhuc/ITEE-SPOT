import Link from "next/link"
import { getAllEvents } from "../actions/events"
import { getAllProject } from "../actions/projects";
import ProjectsClient from "./ProjectsClient";
const Home = async () => {
    const { data: projects, error, totalPages } = await getAllProject({ page: 1 });

    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Our students projects</div>
                <ProjectsClient projects={projects ?? []} totalPages={totalPages} />
            </div>
        </div>
    )
}

export default Home