import { getUser } from "@/app/actions/authentication";
import { getEventChallenges } from "@/app/actions/event_challenges";
import { getSingleEvent } from "@/app/actions/events";
import RegisterClient from "./RegisterClient";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Home({ params }: PageProps) {
    const { id } = await params;
    const { data: event, error } = await getSingleEvent(id)
    const { data: user, error: userError } = await getUser()
    if (error || userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error?.message ? error.message : userError?.message}</div>;
    }

    const { data: challenges, error: challengesError } = await getEventChallenges(id)
    if (challengesError) {

        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {challengesError.message}</div>;

    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-6xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Register for {event?.title}</div>
                <RegisterClient event={event!} user={user.user!} challenges={challenges!} />
            </div>
        </div>
    );
}