'use client'

import { createSubmissionComment, getSubmissionComments } from "@/app/actions/submission_comment";
import { useNotification } from "@/app/context/NotificationContext";
import { SubmissionCommentInsert, SubmissionCommentPagination } from "@/app/types/submission_comments";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm, UseFormGetValues } from "react-hook-form";
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
interface SubmissionCommentProps {
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
    user: User,
}
const SubmissionComment = ({ getValues, user }: SubmissionCommentProps) => {
    const {
        register: commentRegister,
        handleSubmit: handleSubmitComment,
        formState: { errors: commentErrors },
        reset: resetComment,
    } = useForm<SubmissionCommentInsert>()
    const { showNotification } = useNotification()
    const [submissionComments, setSubmissionComments] = useState<SubmissionCommentPagination | null>()
    const [showComment, setShowComment] = useState(false)
    const handleShowComment = async () => {
        try {
            const submissionId = getValues('id')
            if (!submissionId) {
                throw new Error('Please choose a challenge before reaction')
            }
            const { data, totalPages } = await getSubmissionComments({ submissionId, page: 1 })
            setShowComment(true)
            setSubmissionComments({ submissionComments: data, totalPages })
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleCreateComment = async (data: SubmissionCommentInsert) => {
        try {
            const foundComment = submissionComments?.submissionComments.findIndex((ele) => ele.user_id == user.id)
            if (foundComment != -1) {
                throw new Error('You have already comment to the post')
            }
            const submissionId = getValues('id')
            if (!submissionId) {
                throw new Error('Please choose a challenge before reaction')
            }
            data.submission_id = submissionId
            data.user_id = user.id
            const newComment = await createSubmissionComment(data)
            if (newComment) {
                setSubmissionComments({ submissionComments: [...submissionComments?.submissionComments ?? [], newComment], totalPages: submissionComments?.totalPages ?? 0 });
            }
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    return (
        <>
            {showComment == false && <div className="w-full p-5 flex justify-center ">
                <button className="show_comment_button duration-300" onClick={() => handleShowComment()}>
                    <svg className="show_comment_button_svgIcon transform rotate-180" viewBox="0 0 384 512">
                        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></path>
                    </svg>
                </button>
            </div>}
            {showComment &&
                <div className="w-full flex flex-col gap-6 ">

                    <form className="flex flex-col gap-2" onSubmit={handleSubmitComment(handleCreateComment)}>
                        <div className="flex flex-row items-end gap-2 ">

                            <div className="input-group flex-1 relative">
                                <label className="event_input_label">Content</label>
                                <input
                                    autoComplete="off"
                                    placeholder="Write your comment"
                                    id="comment"
                                    className="event_input outline-none w-full h-[40px] px-3 border border-gray-300 rounded placeholder:font-bold bg-gray-50 cursor-not-allowed"
                                    type="text"
                                    {...commentRegister('content', {
                                        required: "Content is required",
                                    })}
                                />
                                {commentErrors.content && (
                                    <p className="text-red-500 text-sm mt-1 absolute top-[100%] left-0">
                                        {commentErrors.content.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="event_input_label">Post as</label>
                                <select
                                    {...commentRegister('display_name', {
                                        required: "Display name is required",
                                    })}
                                    className="h-[40px] border border-gray-300 rounded px-2 outline-none bg-white cursor-pointer"
                                >
                                    <option value="Anonymous">Anonymous</option>
                                    <option value={user?.email}>{user?.email}</option>
                                </select>
                                {commentErrors.display_name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {commentErrors.display_name.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="h-[40px] px-6 bg-black text-white rounded flex items-center gap-2 hover:bg-black/80 cursor-pointer duration-300"
                            >
                                <span className="font-bold">Send</span>
                                <SendIcon fontSize="small" />
                            </button>
                        </div>

                    </form>
                    <div className="flex flex-col gap-4 mt-4 w-full">
                        <h3 className="font-bold text-lg border-b pb-2">Comments</h3>
                        {submissionComments?.submissionComments.map((comment) => (
                            <div key={comment.id} className="flex flex-row gap-3 w-full">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                    <PersonIcon className="text-white" />
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center">
                                        <span className="font-bold text-sm text-gray-900">
                                            {comment.display_name}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap text-gray-700 text-sm mt-1 bg-gray-100 p-2 rounded-lg break-all">
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default SubmissionComment