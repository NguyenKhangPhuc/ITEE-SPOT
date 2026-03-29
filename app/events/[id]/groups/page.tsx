import { getSingleEvent } from "@/app/actions/events";
import { getEventGroups } from "@/app/actions/groups";
import EventGroupsClient from "./EventGroupsClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;
    const { data: event, error: eventError } = await getSingleEvent(id)

    if (eventError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {eventError.message}</div>;
    }
    const { data: groups, error: groupsError } = await getEventGroups(id);

    if (groupsError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {groupsError.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Event {event?.title}&apos;s Groups</div>
                <EventGroupsClient event={event!} eventGroups={groups!} />
            </div>
        </div>
    );
}