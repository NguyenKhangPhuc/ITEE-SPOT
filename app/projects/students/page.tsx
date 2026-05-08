import Link from "next/link"
import StudentManagementClient from "./StudentsMagementClient"
import { getUserGroups } from "@/app/actions/groups";
import { getUser } from "@/app/actions/authentication";
import { getUserSubmittedProjects } from "@/app/actions/projects";
const Home = async () => {
    const { data: groupsWithOtherInfo, error, } = await getUserGroups();
    const { data: user, error: userError } = await getUser();
    if (userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userError.message}</div>;
    }
    const { data: userProjects, error: userProjectsError } = await getUserSubmittedProjects({ userId: user.user!.id, status: null, ascending: false })
    if (userProjectsError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userProjectsError}</div>;
    }

    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Uploading your projects</div>
                <StudentManagementClient groupsWithEvents={groupsWithOtherInfo ?? []} initialUserProjects={userProjects ?? []} />
            </div>
        </div>
    )
}

export default Home