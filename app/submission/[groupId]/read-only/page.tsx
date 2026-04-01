import { getUser } from "@/app/actions/authentication";
import { getEventChallenges } from "@/app/actions/event_challenges";
import { getSingleEvent } from "@/app/actions/events";
import { getGroupChallenges } from "@/app/actions/group_challenge";

import ReadOnlySubmission from "./ReadOnlySubmission";
import { getSubmissionByGroupId } from "@/app/actions/submissions";
import { getUserProfile } from "@/app/actions/profiles";


interface PageProps {
    params: Promise<{ groupId: string }>;
}

export default async function Home({ params }: PageProps) {
    const { groupId } = await params;
    const { data, error } = await getSubmissionByGroupId({ groupId })
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error?.message}</div>;
    }
    const { data: userInfo, error: userError } = await getUser()
    if (userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userError?.message}</div>;
    }
    const { data: userProfile, error: profileError } = await getUserProfile(userInfo.user?.id ?? "")
    if (profileError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {profileError?.message}</div>;
    }
    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-6xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Read Only Submission</div>
                <ReadOnlySubmission groupSubmissions={data} user={userProfile!} />
            </div>
        </div>
    );
}