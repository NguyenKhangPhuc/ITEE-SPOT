import { getSingleEvent } from "@/app/actions/events";
import { getUser } from "@/app/actions/authentication";
import { getUserProfile } from "@/app/actions/profiles";
import StudentProfileClient from "./StudentProfileClient";
import { getUserSubmittedProjects } from "@/app/actions/projects";
import { PROJECT_STATUS } from "@/app/types/enum";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;

    const { data: user, error: userProfileError } = await getUserProfile(id)
    if (userProfileError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userProfileError?.message}</div>;
    }
    const { data: userProjects, error: userProjectsError } = await getUserSubmittedProjects({ userId: user?.id ?? "", status: PROJECT_STATUS.ACCEPTED, ascending: false })
    if (userProjectsError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userProjectsError}</div>;
    }
    return (
        <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
            <div className="max-w-7xl mx-auto flex flex-col">
                <StudentProfileClient user={user!} userProjects={userProjects ?? []} />
            </div>
        </div>
    );
}