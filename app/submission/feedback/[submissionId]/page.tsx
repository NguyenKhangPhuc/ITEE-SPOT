import { getUser } from "@/app/actions/authentication"
import { getSubmissionById } from "@/app/actions/submissions"
import { getSubmissionFeedBackBySubmissionId } from "@/app/actions/submission_feedback"
import SubmissionFeedbackClient from "./SubmissionFeedbackClient"
import BackButton from "@/app/components/BackButton"
import { tw } from "@/app/constants/design-tokens"

interface PageProps {
    params: Promise<{ submissionId: string }>
}

export default async function Home({ params }: PageProps) {
    const { submissionId } = await params
    const { data, error } = await getSubmissionById(submissionId)
    
    if (error) {
        return (
            <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-mono flex flex-col p-6 py-12 items-center justify-center select-none`}>
                <div className={`${tw.bg.surfaceContainerLow} border ${tw.border.whiteSubtle} p-6 rounded-sm max-w-md w-full flex flex-col gap-4`}>
                    <div className="flex items-center gap-2 text-[#ffb4ab] text-xs font-mono font-bold uppercase">
                        <span className="material-symbols-outlined text-sm">error</span>
                        <span>SUBMISSION_NOT_FOUND</span>
                    </div>
                    <p className={`text-xs ${tw.text.outline} font-mono`}>
                        {error?.message || "Failed to load target submission."}
                    </p>
                    <BackButton />
                </div>
            </div>
        )
    }

    const { data: user, error: userError } = await getUser()
    if (userError || !user || !user.user?.id) {
        return (
            <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-mono flex flex-col p-6 py-12 items-center justify-center select-none`}>
                <div className={`${tw.bg.surfaceContainerLow} border ${tw.border.whiteSubtle} p-6 rounded-sm max-w-md w-full flex flex-col gap-4`}>
                    <div className="flex items-center gap-2 text-[#ffb4ab] text-xs font-mono font-bold uppercase">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        <span>AUTHENTICATION_REQUIRED</span>
                    </div>
                    <p className={`text-xs ${tw.text.outline} font-mono`}>
                        {userError?.message || "You must be authenticated to view submission feedback."}
                    </p>
                    <BackButton />
                </div>
            </div>
        )
    }

    const { data: feedbacks, error: feedbacksError } = await getSubmissionFeedBackBySubmissionId({ submissionId })

    if (feedbacksError) {
        return (
            <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-mono flex flex-col p-6 py-12 items-center justify-center select-none`}>
                <div className={`${tw.bg.surfaceContainerLow} border ${tw.border.whiteSubtle} p-6 rounded-sm max-w-md w-full flex flex-col gap-4`}>
                    <div className="flex items-center gap-2 text-[#ffb4ab] text-xs font-mono font-bold uppercase">
                        <span className="material-symbols-outlined text-sm">error</span>
                        <span>FEEDBACK_FETCH_FAILED</span>
                    </div>
                    <p className={`text-xs ${tw.text.outline} font-mono`}>
                        {feedbacksError?.message || "Failed to retrieve submission feedbacks."}
                    </p>
                    <BackButton />
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-mono flex flex-col p-6 py-12 select-text`}>
            <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
                {/* Back Navigation Button */}
                <BackButton />

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-2 select-none">
                    <div className="flex gap-4 items-stretch">
                        <div className="w-[3px] bg-[#00e0b3]" />
                        <div className="flex flex-col gap-1.5">
                            <span className={`text-[8px] font-mono ${tw.text.outline} uppercase tracking-widest`}>
                                SUBMISSION // EVALUATION_FEEDBACK
                            </span>
                            <h1 className={`text-2xl md:text-3xl font-extrabold ${tw.text.onBackground} tracking-tight uppercase leading-tight font-mono`}>
                                FEEDBACKS: <span className={tw.text.mint}>{data?.title}</span>
                            </h1>
                        </div>
                    </div>

                    <div className={`text-[8px] font-mono ${tw.text.mint} border ${tw.border.mintSubtle} ${tw.bg.mintSubtle} px-3 py-1 rounded-sm tracking-widest font-bold uppercase select-none self-start md:self-auto`}>
                        [FEEDBACK_RECORDS]
                    </div>
                </div>

                {/* Main Client Feedback List */}
                <SubmissionFeedbackClient submissionFeedbacks={feedbacks ?? []} />
            </div>
        </div>
    )
}