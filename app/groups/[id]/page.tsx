import { getUser } from "@/app/actions/authentication";
import { getSingleEvent } from "@/app/actions/events";
import { getSingleGroup } from "@/app/actions/groups";
import GroupsClient from "../GroupsClient";
import SingleGroupClient from "./SingleGroupClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;
    const { data: groupInfo, error: groupError } = await getSingleGroup({ groupId: id })
    const { data: user, error: userError } = await getUser()
    if (groupError || userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {groupError?.message ? groupError?.message : userError?.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Your group</div>
                <SingleGroupClient groupInfo={groupInfo} currentUser={user.user!} />
            </div>
        </div>
    );
}