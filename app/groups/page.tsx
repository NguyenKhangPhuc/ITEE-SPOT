import { getUser } from "@/app/actions/authentication";
import { getEventChallenges } from "@/app/actions/event_challenges";
import { getSingleEvent } from "@/app/actions/events";
import { getUserGroups } from "../actions/groups";
import { Event } from "../types/event";
import GroupsClient from "./GroupsClient";

export type GroupEvents = {
    created_at: string;
    group_id: string | null;
    id: string;
    member_id: string | null;
    groups: {
        created_at: string;
        event_id: string | null;
        group_name: string | null;
        id: string;
        events: {
            content: string | null;
            created_at: string;
            end_date: string | null;
            id: string;
            location: string | null;
            max_group_members: number | null;
            organized_date: string | null;
            owner_id: string | null;
            poster_path: string | null;
            short_description: string | null;
            start_date: string | null;
            status: "ongoing" | "finished" | null;
            title: string | null;
        } | null;
    } | null;
}[] | null
export default async function Home() {
    const { data, error } = await getUserGroups()
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Đã có lỗi xảy ra: {error.message}</div>;
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