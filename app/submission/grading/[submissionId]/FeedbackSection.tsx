'use client'
import { updateSubmissionFeedback } from "@/app/actions/submission_feedback"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { PROFILE_ROLE } from "@/app/types/enum"
import { Profile } from "@/app/types/profile"
import { SubmissionWithEventId } from "@/app/types/submission"
import { SubmissionFeedback, SubmissionFeedbackInsert } from "@/app/types/submission_feedback"
import { useForm } from "react-hook-form"

interface FeedbackSectionProps {
    userSubmissionFeedback: SubmissionFeedback | null,
    user: Profile,
    submission: SubmissionWithEventId,
}

const FeedbackSection = ({ userSubmissionFeedback, user, submission }: FeedbackSectionProps) => {
    const { setIsOpenLoader } = useLoader()
    const { showNotification } = useNotification()
    const { register: registerFeedback, handleSubmit: handleSubmitFeedbackInfo, formState: { errors } } = useForm<SubmissionFeedbackInsert>({
        defaultValues: userSubmissionFeedback ?? {
            user_id: user.id,
            submission_id: submission?.id
        }
    })
    const handleUpdateYourFeedback = async (feedback: SubmissionFeedbackInsert) => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await updateSubmissionFeedback({ submissionFeedback: feedback })
            if (error) {
                throw new Error(error)
            }
            setIsOpenLoader(false)
            showNotification("Update the feedback successfully")
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    return (
        <form className="w-full flex flex-col mt-10 gap-5" onSubmit={handleSubmitFeedbackInfo(handleUpdateYourFeedback)}>
            <div className="text-black text-lg font-bold ">Leave a feedback</div>

            <div className="flex flex-col">
                <label className="event_input_label">Post as</label>
                <select
                    {...registerFeedback('display_name', {
                        required: "Display name is required",
                    })}
                    className="h-[40px] border border-gray-300 rounded px-2 outline-none bg-white cursor-pointer"
                >
                    {(user.role == PROFILE_ROLE.ADMIN || user.role == PROFILE_ROLE.JUDGES) && <option value="Anonymous Company Representatives">Anonymous Company Representatives</option>}
                    <option value={user?.full_name ?? ""}>{user?.full_name && user.full_name.length != 0 ? user?.full_name : "Empty, please edit your profile"}</option>
                    <option value={user?.company_name ?? ""}>{user?.company_name && user.company_name.length != 0 ? user?.company_name : "Empty, please edit your profile"}</option>
                </select>
                {errors.display_name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.display_name.message}
                    </p>
                )}
            </div>

            <div className="input-group relative">
                <label className="event_input_label">Feedback</label>
                <textarea
                    autoComplete="off"
                    placeholder="Write your comments/questions"
                    id="comment"
                    className="event_input outline-none w-full h-[120px] px-3 border border-gray-300 rounded placeholder:font-bold bg-gray-500"

                    {...registerFeedback('content', {
                        required: "Content is required",
                    })}
                />
                {errors.content && (
                    <p className="text-red-500 text-sm mt-1 md:absolute top-[100%] left-0">
                        {errors.content.message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                className="mt-1 w-full bg-black text-white py-2 rounded-lg hover:bg-black/80 duration-300 cursor-pointer"
            >
                Submit your feedbacks
            </button>
        </form>
    )
}

export default FeedbackSection