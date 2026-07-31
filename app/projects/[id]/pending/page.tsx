import { getSingleEvent } from "@/app/actions/events";

import { getUser } from "@/app/actions/authentication/get/getUser";
import { getUserProfile } from "@/app/actions/profiles";
import { getSingleProject } from "@/app/actions/projects";
import SingleProjectClient from "../SingleProjectClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;
    const { data: project, error } = await getSingleProject({ projectId: id })
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error}</div>;
    }

    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <SingleProjectClient project={project!} />
            </div>
        </div>
    );
}