import { getUser } from "@/app/actions/authentication";
import { getEventChallenges } from "@/app/actions/event_challenges";
import { getSingleEvent } from "@/app/actions/events";
import { getGroupChallenges } from "@/app/actions/group_challenge";
import SubmissionClient from "./SubmissionClient";
import { Group } from "@/app/types/group";
import { EventChallenge } from "@/app/types/event_challenges";


interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default async function Home({ params }: PageProps) {
    const { groupId } = await params;
    const { data, error } = await getGroupChallenges({ groupId })
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error?.message}</div>;
    }
    const eventChallenges: Array<EventChallenge> = data!.map((e) => {
        return e.event_challenges!
    })
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-6xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Submission</div>
                <SubmissionClient groupChallenges={data!} eventChallenges={eventChallenges!} group_id={groupId} />
            </div>
        </div>
    );
}