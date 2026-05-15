import { getUser } from "@/app/actions/authentication";
import { getEventCriteriaById } from "@/app/actions/event_criteria";
import { getSingleEvent } from "@/app/actions/events";
import { getEventGroups } from "@/app/actions/groups";
import EventSubmissionGrade from "./EventSubmissionGrade";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;
    const { data: event, error: eventError } = await getSingleEvent(id)

    if (eventError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {eventError.message}</div>;
    }

    const { data: user, error: userError } = await getUser()

    if (userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userError.message}</div>;
    }
    const { data: eventCriteria, error: criteriaError } = await getEventCriteriaById(id)

    if (criteriaError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {criteriaError?.message}</div>;
    }

    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Submission Grade of Event {event?.title}</div>
                <EventSubmissionGrade eventCriteria={eventCriteria ?? []} user={user.user!} eventId={id} />
            </div>
        </div>
    );
}