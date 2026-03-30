import { getSingleEvent } from "@/app/actions/events";
import { getEventGroups } from "@/app/actions/groups";
import EditEventClient from "./EditEventClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;
    const { data: event, error: eventError } = await getSingleEvent(id)

    if (eventError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {eventError.message}</div>;
    }

    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-6xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Edit Event {event?.title}</div>
                <EditEventClient event={event!} />
            </div>
        </div>
    );
}