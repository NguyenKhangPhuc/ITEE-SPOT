'use client'

import { createReaction, deleteReaction } from "@/app/actions/submission_reaction"
import { useNotification } from "@/app/context/NotificationContext"
import { SubmissionReaction, SubmissionReactionInsert } from "@/app/types/submission_reactions"
import { User } from "@supabase/supabase-js"
import { UseFormGetValues, UseFormRegister } from "react-hook-form"
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
interface SubmissionReactionsProps {
    submissionReaction: SubmissionReaction[]
    setSubmissionReaction: React.Dispatch<React.SetStateAction<SubmissionReaction[]>>
    user: User,
    getValues: UseFormGetValues<{
        created_at?: string;
        description?: string | null;
        github_link?: string | null;
        group_challenge_id?: string | null;
        group_id?: string | null;
        id?: string;
        short_description?: string | null;
        youtube_link?: string | null;
    }>
}
const SubmissionReactions = ({ submissionReaction, setSubmissionReaction, user, getValues }: SubmissionReactionsProps) => {
    const { showNotification } = useNotification()
    const handleReaction = async () => {
        const foundReaction = submissionReaction.findIndex((reaction) => reaction.user_id == user.id)
        if (foundReaction != -1) {
            try {
                const submissionId = getValues('id')
                if (!submissionId) {
                    throw new Error('Please choose a challenge before reaction')
                }
                await deleteReaction({ submissionId: submissionId ?? "", userId: user.id })
                const newReactions = submissionReaction.filter(r => r.user_id !== user.id);
                console.log(newReactions)
                setSubmissionReaction(newReactions)
            } catch (error) {
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }
        } else {
            try {
                const submissionId = getValues('id')
                if (!submissionId) {
                    throw new Error('Please choose a challenge before reaction')
                }
                const data = await createReaction({ submissionId: submissionId ?? "", userId: user.id })
                if (data == null) {
                    throw new Error('Error when trying to create reaction')
                }
                setSubmissionReaction([...submissionReaction, data])
            } catch (error) {
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }
        }
    }

    const handleCheckReaction = () => {
        const foundReaction = submissionReaction.findIndex((reaction) => reaction.user_id == user.id)
        console.log(foundReaction)
        if (foundReaction == -1) {
            return false
        }
        return true
    }
    return (
        <div className="w-full flex h-10 border border-gray-400 rounded-lg">
            <div
                className="w-1/2 flex justify-center h-full items-center cursor-pointer hover:bg-gray-100 border-r border-gray-300 gap-2 transition-colors duration-300"
                onClick={() => handleReaction()}
            >
                <ThumbUpAltIcon fontSize="small" sx={{ color: `${handleCheckReaction() ? 'blue' : 'black'}` }} />
                <span className="font-medium">{submissionReaction.length}</span>
            </div>

            <a
                href="#comments"
                className="w-1/2 flex justify-center h-full items-center cursor-pointer hover:bg-gray-100 gap-2 duration-300"
            >
                <CommentIcon fontSize="small" />
                <span className="font-medium">Comments 0</span>
            </a>
        </div>
    )
}

export default SubmissionReactions