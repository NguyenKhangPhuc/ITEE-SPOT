import { getUser } from "@/app/actions/authentication";
import { getEventCriteriaById } from "@/app/actions/event_criteria";
import { getSubmissionById } from "@/app/actions/submissions";
import { getUserGradingForSubmissionById } from "@/app/actions/user_grading";
import { getSubmissionFeedBackBySubmissionId, getSubmissionFeedBackByUserIdAndSubmissionId } from "@/app/actions/submission_feedback";
import { getUserProfile } from "@/app/actions/profiles";
import SubmissionFeedBackClient from "./SubmissionFeedbackClient";


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
    if (!user || !user.user?.id) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong: </div>;
    }


    const { data: feedbacks, error: feedbacksError } = await getSubmissionFeedBackBySubmissionId({ submissionId: submissionId })

    if (feedbacksError) {
        return <div className="w-full flex items-center justify-center text-red-500">Something went wrong:  {feedbacksError?.message}</div>;
    }

    return (
        <div className="w-full min-h-screen screen-bg font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col p-5 ">
                <div className="text-2xl font-bold text-color">Feedbacks for submission {data?.title}</div>
                <SubmissionFeedBackClient submissionFeedbacks={feedbacks ?? []} />
            </div>
        </div>
    );
}