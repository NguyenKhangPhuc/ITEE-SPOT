import Link from "next/link"
import StudentManagementClient from "./StudentsMagementClient"
import { getUserGroups } from "@/app/actions/groups";
import { getUser } from "@/app/actions/authentication";
const Home = async () => {
    const { data: groupsWithOtherInfo, error, } = await getUserGroups();

    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Uploading your projects</div>
                <StudentManagementClient groupsWithEvents={groupsWithOtherInfo ?? []} />
            </div>
        </div>
    )
}

export default Home