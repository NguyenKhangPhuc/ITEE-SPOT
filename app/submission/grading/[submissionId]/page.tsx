import { getUser } from "@/app/actions/authentication/get/getUser";
import { getEventCriteriaById } from "@/app/actions/event_criteria/get/getEventCriteriaById";
import { getSubmissionById } from "@/app/actions/submissions";
import SubmissionGradingClient from "./SubmissionGradingClient";
import { getUserGradingForSubmissionById } from "@/app/actions/user_grading";
import { getUserProfile } from "@/app/actions/profiles";


interface PageProps {
    params: Promise<{ submissionId: string }>;
}

export default async function Home({ params }: PageProps) {
    const { submissionId } = await params;
    const { data, error } = await getSubmissionById(submissionId)
    if (error) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {error?.message}</div>;
    }
    const { data: user, error: userError } = await getUser()
    if (userError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userError?.message}</div>;
    }
    if (!data?.groups?.event_id || !user || !user.user?.id) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong: </div>;
    }
    const { data: eventCriteria, error: criteriaError } = await getEventCriteriaById(data?.groups?.event_id)

    if (criteriaError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {criteriaError?.message}</div>;
    }

    const { data: userGrade, error: userGradeError } = await getUserGradingForSubmissionById({ userId: user.user.id, submissionId: data.id })

    if (userGradeError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {userGradeError?.message}</div>;
    }



    const { data: userProfile, error: profileError } = await getUserProfile(user.user.id)
    if (profileError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {profileError?.message}</div>;
    }

    return (
        <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono px-6 md:px-16 py-24">
            <div className="max-w-7xl mx-auto flex flex-col">
                <SubmissionGradingClient eventCriteria={eventCriteria ?? []} submission={data} user={userProfile!} userGrading={userGrade ?? []} />
            </div>
        </div>
    );
}