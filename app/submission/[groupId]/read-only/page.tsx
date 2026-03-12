import { getUser } from "@/app/actions/authentication";
import { getEventChallenges } from "@/app/actions/event_challenges";
import { getSingleEvent } from "@/app/actions/events";
import { getGroupChallenges } from "@/app/actions/group_challenge";

import ReadOnlySubmission from "./ReadOnlySubmission";


interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default async function Home({ params }: PageProps) {
    const { groupId } = await params;
    const { data, error } = await getGroupChallenges({ groupId })
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Đã có lỗi xảy ra: {error?.message}</div>;
    }
    const { data: userInfo, error: userError } = await getUser()
    if (userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Đã có lỗi xảy ra: {userError?.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold">Read Only Submission</div>
                <ReadOnlySubmission groupChallenges={data} user={userInfo.user!} />
            </div>
        </div>
    );
}