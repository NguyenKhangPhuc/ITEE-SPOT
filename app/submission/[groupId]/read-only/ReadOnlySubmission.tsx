'use client'
import { getGoupChallengeSubmission, saveGroupChallengeSubmission } from "@/app/actions/submissions"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { useNotification } from "@/app/context/NotificationContext"
import { EventChallenge } from "@/app/types/event_challenges"
import { GroupChallengeRelation, GroupChallengeWithGroupAndChallenge } from "@/app/types/group_challenge"
import { SubmissionInsert } from "@/app/types/submission"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ClearIcon from '@mui/icons-material/Clear';
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
const ReadOnlySubmission = ({ groupChallenges, user }: { groupChallenges: GroupChallengeWithGroupAndChallenge, user: User }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues
    } = useForm<SubmissionInsert>()
    const [chosenGroupChallenges, setChosenGroupChallenges] = useState<number | null>(null)
    const [initialEditorContent, setInitialEditorContent] = useState<string | null>(null)
    const [submittedFiles, setSubmittedFiles] = useState<Array<SubmissionFileExtended>>([])
    const [submissionReaction, setSubmissionReaction] = useState<Array<SubmissionReaction>>([])
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

    const handleChooseChallengeSubmission = async (index: number) => {
        try {
            const data = await getGoupChallengeSubmission({ groupChallengeId: groupChallenges![index].id, groupId: groupChallenges![index].group_id! })
            setChosenGroupChallenges(index)
            if (data) {
                reset(data)
                setInitialEditorContent(data.description)
                setSubmittedFiles(data.submission_files!)
                setSubmissionReaction(data?.submission_reactions)
            } else {
                reset({
                    id: undefined,
                    github_link: "",
                    youtube_link: "",
                    short_description: "",
                    group_challenge_id: undefined,
                    group_id: undefined,
                    created_at: undefined
                })
                setInitialEditorContent(null)
                setSubmittedFiles([])
            }

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
    return (
        <div className="flex flex-col pt-5 pb-10 gap-5 items-start" >
            <div className="flex flex-col gap-4 w-full mt-4">
                <div className="text-lg font-bold uppercase tracking-tight">Select Challenges</div>
                <div className="grid grid-cols-2 gap-4">
                    {groupChallenges?.map((challenge, index) => (
                        <div key={challenge.id} className={`rounded-xl group relative cursor-pointer duration-300 ${chosenGroupChallenges == index ? 'shadow-xl/30 translate-y-2' : ''}`
                        } onClick={() => handleChooseChallengeSubmission(index)}>

                            <div className="relative w-full p-5 border rounded-xl peer-checked:border-black peer-checked:bg-gray-50 transition-all">
                                <div className="text-sm w-2/3 font-light">{challenge.event_challenges?.company_name}</div>
                                <h4 className="font-bold w-2/3">{challenge.event_challenges?.company_name}</h4>

                            </div>
                        </div>
                    ))}
                </div>
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
                    {submittedFiles?.length > 0 && (

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

                    )}
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
                </>
            }

        </div>
    )
}

export default ReadOnlySubmission