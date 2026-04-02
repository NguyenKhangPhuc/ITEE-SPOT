import { SubmissionFeedback } from "@/app/types/submission_feedback"
import PersonIcon from '@mui/icons-material/Person';
const SubmissionFeedBackClient = ({ submissionFeedbacks }: { submissionFeedbacks: Array<SubmissionFeedback> }) => {
    return (
        <div className="w-full flex flex-col p-5 content-main-color  min-h-[400px] sm:max-h-[600px] max-h-[500px] overflow-y-auto rounded-xl mt-5">
            {submissionFeedbacks.map((feedback, index) => {
                return (
                    <div key={feedback.id} className="flex flex-row gap-3 w-full">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                            <PersonIcon className="text-white" />
                        </div>

                        <div className="flex flex-col min-w-0">
                            <div className="flex flex-col justify-center">
                                <span className="font-bold text-sm text-gray-900">
                                    {feedback.display_name}
                                </span>
                                <span className="text-[10px] text-gray-500 opacity-50 leading-none mt-0.5">
                                    {feedback.created_at ? new Date(feedback.created_at).toLocaleString('fi-FI', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }) : 'Vừa xong'}
                                </span>
                            </div>
                            <div className="max-w-full overflow-x-auto flex flex-wrap text-gray-700 text-sm mt-1 bg-gray-100 p-2 rounded-lg break-words">
                                {feedback.content}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default SubmissionFeedBackClient