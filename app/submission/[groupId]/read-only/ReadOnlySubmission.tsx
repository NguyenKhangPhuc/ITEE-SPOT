'use client'
import { getGoupChallengeSubmission, saveGroupChallengeSubmission } from "@/app/actions/submissions"
import YoutubeVideo from "@/app/components/YoutubeVideo"
import { useNotification } from "@/app/context/NotificationContext"
import { GroupChallengeWithGroupAndChallenge } from "@/app/types/group_challenge"
import { GroupSubmissions, SubmissionInsert } from "@/app/types/submission"
import React, { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { SubmissionFileExtended } from "@/app/types/submission_files"
import { SubmissionReaction } from "@/app/types/submission_reactions"
import { User } from "@supabase/supabase-js"
import { createReaction, deleteReaction } from "@/app/actions/submission_reaction"
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import { SubmissionCommentInsert, SubmissionCommentPagination } from "@/app/types/submission_comments"
import { createSubmissionComment, getSubmissionComments } from "@/app/actions/submission_comment"
import { createSubmissionRating, getSubmissionRatingById } from "@/app/actions/submission_ratings"
import { SubmissionRatingInsert } from "@/app/types/submission_rating"
import SubmissionInfo from "./SubmissionInfo"
import SubmissionFiles from "./SubmissionFiles"
import SubmissionRating from "./SubmissionRating"
import SubmissionReactions from "./SubmissionReactions"
import SubmissionComment from "./SubmissionComment"
import { Profile, ProfileInsert } from "@/app/types/profile"
import { PROFILE_ROLE } from "@/app/types/enum"
import Link from "next/link"
const ReadOnlySubmission = ({ groupSubmissions, user }: { groupSubmissions: GroupSubmissions, user: ProfileInsert }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control
    } = useForm<SubmissionInsert>()
    const descriptionValue = useWatch({
        control: control,
        name: "short_description",
    });
    const [chosenGroupChallenges, setChosenGroupChallenges] = useState<number | null>(null)
    const [initialEditorContent, setInitialEditorContent] = useState<string | null>(null)
    const [submittedFiles, setSubmittedFiles] = useState<Array<SubmissionFileExtended>>([])
    const [submissionReaction, setSubmissionReaction] = useState<Array<SubmissionReaction>>([])

    const [userRating, setUserRating] = useState<SubmissionRatingInsert | null>(null)
    const { showNotification } = useNotification()

    const handleChooseChallengeSubmission = async (index: number) => {
        try {
            const { data: receivedUserRating, error } = await getSubmissionRatingById({ submissionId: groupSubmissions![index].id!, userId: user.id })
            if (error) {
                throw new Error(error)
            }
            if (receivedUserRating) {
                setUserRating(receivedUserRating)
            }
            setChosenGroupChallenges(index)
            reset(groupSubmissions![index])
            setSubmissionReaction(groupSubmissions![index].submission_reactions)
            setSubmittedFiles(groupSubmissions![index].submission_files)
            setInitialEditorContent(groupSubmissions![index].description)
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




    return (
        <div className="flex flex-col mt-5 content-main-color p-5 rounded-xl gap-5 items-start" >
            <div className="flex flex-col gap-4 w-full mt-4">
                <div className="text-lg font-bold uppercase tracking-tight">Select Challenges</div>
                {groupSubmissions == null ? <div>
                    No submission yet
                </div> : <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
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
            {chosenGroupChallenges != null && groupSubmissions != null &&
                <>
                    <SubmissionInfo
                        initialContent={initialEditorContent ?? ""}
                        register={register}
                        errors={errors}
                        handleGetEmbeddedUrl={handleGetEmbeddedUrl}
                        descriptionValue={descriptionValue ?? ""}
                    />

                    <SubmissionFiles submittedFiles={submittedFiles} />

                    <SubmissionRating user={user} userRating={userRating} setUserRating={setUserRating} getValues={getValues} />

                    <SubmissionReactions getValues={getValues} submissionReaction={submissionReaction} setSubmissionReaction={setSubmissionReaction} user={user} />

                    <SubmissionComment getValues={getValues} user={user} />

                    <div className="w-full flex gap-5">

                        <Link href={`/submission/grading/${groupSubmissions[chosenGroupChallenges].id}`} className="duration-300 cursor-pointer text-black
                     p-5 text-center w-full h-13 border-4 border-black bg-white 
                     hover:scale-105 rounded-[10px] flex items-center justify-center ">
                            Grade this project
                        </Link>
                    </div>
                </>
            }

        </div>
    )
}

export default ReadOnlySubmission