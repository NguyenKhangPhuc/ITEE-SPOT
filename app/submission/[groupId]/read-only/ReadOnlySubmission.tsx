'use client'
import { getGoupChallengeSubmission, saveGroupChallengeSubmission } from "@/app/actions/submissions"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { useNotification } from "@/app/context/NotificationContext"
import { GroupChallengeWithGroupAndChallenge } from "@/app/types/group_challenge"
import { GroupSubmissions, SubmissionInsert } from "@/app/types/submission"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { getSignedUrl } from "@/app/actions/file_url"
import ReadOnlyEditor from "@/components/tiptap-templates/simple/ReadOnlyEditor"
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';
import { SubmissionReaction } from "@/app/types/submission_reactions"
import { User } from "@supabase/supabase-js"
import { createReaction, deleteReaction } from "@/app/actions/submission_reaction"
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import { SubmissionCommentInsert, SubmissionCommentPagination } from "@/app/types/submission_comments"
import { createSubmissionComment, getSubmissionComments } from "@/app/actions/submission_comment"
import { createSubmissionRating, getSubmissionRatingById } from "@/app/actions/submission_ratings"
import { SubmissionRatingInsert } from "@/app/types/submission_rating"
const ReadOnlySubmission = ({ groupSubmissions, user }: { groupSubmissions: GroupSubmissions, user: User }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues
    } = useForm<SubmissionInsert>()

    const {
        register: commentRegister,
        handleSubmit: handleSubmitComment,
        formState: { errors: commentErrors },
        reset: resetComment,
    } = useForm<SubmissionCommentInsert>()
    const [chosenGroupChallenges, setChosenGroupChallenges] = useState<number | null>(null)
    const [initialEditorContent, setInitialEditorContent] = useState<string | null>(null)
    const [submittedFiles, setSubmittedFiles] = useState<Array<SubmissionFileExtended>>([])
    const [submissionReaction, setSubmissionReaction] = useState<Array<SubmissionReaction>>([])
    const [submissionComments, setSubmissionComments] = useState<SubmissionCommentPagination | null>()
    const [showComment, setShowComment] = useState(false)
    const [userRating, setUserRating] = useState<SubmissionRatingInsert | null>(null)
    const { showNotification } = useNotification()

    const handleDownloadFile = async (file: SubmissionFileExtended) => {
        if (file.storage_path != null && file.storage_path != "") {
            try {
                const data = await getSignedUrl(file.storage_path)
                if (data.signedUrl) {
                    window.open(data.signedUrl, '_blank');
                }
            } catch (error) {
                console.log(error)
                if (error instanceof Error) {
                    showNotification(error.message)
                }
            }
        } else {
            const localUrl = URL.createObjectURL(file.file!);
            window.open(localUrl, '_blank');
        }
    }
    console.log(userRating)
    const handleChooseChallengeSubmission = async (index: number) => {
        try {
            const receivedUserRating = await getSubmissionRatingById({ submissionId: groupSubmissions![index].id!, userId: user.id })
            if (receivedUserRating) {
                setUserRating(receivedUserRating)
                console.log(receivedUserRating)
            }
            setChosenGroupChallenges(index)
            reset(groupSubmissions![index])

        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleGetEmbeddedUrl = () => {
        const currentLink = getValues('youtube_link');
        try {
            const urlObj = new URL(currentLink ?? "");
            let videoId = "";

            if (urlObj.hostname.includes("youtube.com")) {
                videoId = urlObj.searchParams.get("v")!;
            } else if (urlObj.hostname === "youtu.be") {
                videoId = urlObj.pathname.slice(1);
            }

            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (e) {
            return null;
        }
    }

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
    const handleRating = async (value: string) => {
        try {
            const submissionId = getValues('id')
            if (!submissionId) {
                throw new Error('Please choose a challenge before reaction')
            }
            const upsertedRating: SubmissionRatingInsert = {
                submission_id: submissionId,
                user_id: user.id,
                rating: parseInt(value),
            }

            await createSubmissionRating({ submissionRating: upsertedRating })
            setUserRating(upsertedRating)
            showNotification('Give a rating successfully')
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    return (
        <div className="flex flex-col mt-5 content-main-color p-5 rounded-xl gap-5 items-start" >
            <div className="flex flex-col gap-4 w-full mt-4">
                <div className="text-lg font-bold uppercase tracking-tight">Select Challenges</div>
                {groupSubmissions == null ? <div>
                    No submission yet
                </div> : <div className="grid grid-cols-2 gap-4">
                    {groupSubmissions?.map((submission, index) => (
                        <div key={submission.id} className={`rounded-xl group relative cursor-pointer duration-300 ${chosenGroupChallenges == index ? 'shadow-xl/30 translate-y-2' : ''}`
                        } onClick={() => handleChooseChallengeSubmission(index)}>

                            <div className="relative w-full p-5 border rounded-xl peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                                <div className="text-sm w-2/3 font-light">{submission.group_challenge?.event_challenges?.company_name}</div>
                                <h4 className="font-bold w-2/3">{submission.group_challenge?.event_challenges?.title}</h4>

                            </div>
                        </div>
                    ))}
                </div>}
            </div>
            {chosenGroupChallenges != null &&
                <>
                    <div className="input-group w-full">
                        <label className="event_input_label">Github Link</label>
                        <input autoComplete="off" placeholder="Github source code link" id="Title"
                            className="event_input outline-none w-full  h-[40px] placeholder:font-bold cursor-not-allowed" type="text"
                            disabled
                            {...register('github_link', {
                                required: "Github link is required",
                            })} />
                        {errors.github_link && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.github_link.message}
                            </p>
                        )}
                    </div>
                    <div className="input-group w-full">
                        <label className="event_input_label">Youtube Link</label>
                        <input autoComplete="off" placeholder="Demo video link" id="Title"
                            className="event_input outline-none w-full  h-[40px] placeholder:font-bold cursor-not-allowed" type="text"
                            disabled
                            {...register('youtube_link', {
                                required: "Youtube link is required",
                            })} />
                        {errors.youtube_link && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.youtube_link.message}
                            </p>
                        )}
                    </div>
                    <YoutubeVideo embeddedUrl={handleGetEmbeddedUrl() ?? ""} />
                    <div className="input-group w-full ">
                        <label className="event_input_label">Short Description</label>
                        <textarea
                            disabled
                            autoComplete="off"
                            placeholder="Short Description"
                            className="event_input outline-none w-full placeholder:font-bold h-[80px] cursor-not-allowed"
                            {...register('short_description', {
                                required: "Short description is required",
                            })}
                        />
                        {errors.short_description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.short_description.message}
                            </p>
                        )}
                    </div>
                    <div className="shadow-xl/30 inset-shadow-sm rounded-xl w-full p-5 cursor-not-allowed">
                        <ReadOnlyEditor content={initialEditorContent ?? ""} />
                    </div>

                    <div className="text-lg font-bold uppercase tracking-tight">Submitted File</div>
                    {submittedFiles?.length > 0 ? (

                        <div className="grid grid-cols-7 gap-4 w-full">
                            {submittedFiles.map((fileItem, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleDownloadFile(fileItem)}
                                    className="cursor-pointer relative h-30 min-w-full flex flex-col items-center justify-center p-2 bg-white rounded-md border border-gray-100 shadow-xl shadow-black/30 hover:scale-105 group duration-300 cursor"
                                >
                                    <button

                                        className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 text-black transition-opacity duration-300"
                                        type="button"
                                    >
                                        <DownloadIcon sx={{ fontSize: '18px' }} />
                                    </button>

                                    <div className="text-gray-400 mb-1">
                                        <InsertDriveFileIcon />
                                    </div>

                                    <span className="text-[13px] text-center font-medium text-black break-all line-clamp-2 px-1">
                                        {fileItem.original_file_name}
                                    </span>
                                </div>
                            ))}
                        </div>

                    ) : <div className="text-sm opacity-70">Student did not upload anything</div>}

                    <div className="w-full flex flex-col items-start">
                        <div className="text-lg font-bold uppercase tracking-tight">Rate the project</div>
                        <div className="rating">
                            {[5, 4, 3, 2, 1].map((num) => {
                                return <React.Fragment key={`star ${num}`}>
                                    <input value={num} name="rate" id={`start${num}`} type="radio" onChange={(e) => handleRating(e.target.value)}
                                        checked={userRating?.rating == num}
                                    />
                                    <label title="text" htmlFor={`start${num}`} ></label>
                                </React.Fragment>
                            })}
                        </div>
                    </div>
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
                            // onClick={() => setShowComments(!showComments)}
                            className="w-1/2 flex justify-center h-full items-center cursor-pointer hover:bg-gray-100 gap-2 duration-300"
                        >
                            <CommentIcon fontSize="small" />
                            <span className="font-medium">Comments 0</span>
                        </a>
                    </div>
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
            }

        </div>
    )
}

export default ReadOnlySubmission