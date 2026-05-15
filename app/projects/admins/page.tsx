import Link from "next/link"
import { getUserGroups } from "@/app/actions/groups";
import { getUser } from "@/app/actions/authentication";
import { getAllProjects } from "@/app/actions/projects";
import ProjectsAdminClient from "./ProjectsAdminClient";
import { getAllEventsWithGroupAndAward } from "@/app/actions/events";
const Home = async () => {
    const { data: projects, error } = await getAllProjects();
    const { data: eventsWithGroupsAndAward, error: eventsError } = await getAllEventsWithGroupAndAward()
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error}</div>;
    }
    if (eventsError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Manage showcasing projects</div>
                <ProjectsAdminClient projects={projects ?? []} eventsWithGroupsAndAwards={eventsWithGroupsAndAward ?? []} />
            </div>
        </div>
    )
}

export default Home