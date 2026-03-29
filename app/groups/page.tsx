import { getUser } from "@/app/actions/authentication";
import { getEventChallenges } from "@/app/actions/event_challenges";
import { getSingleEvent } from "@/app/actions/events";
import { getUserGroups } from "../actions/groups";
import { Event } from "../types/event";
import GroupsClient from "./GroupsClient";


export default async function Home() {
    const { data, error } = await getUserGroups()
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error.message}</div>;
    }

    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Your registed groups</div>
                <GroupsClient groupsWithEvents={data} />
            </div>
        </div>
    );
}