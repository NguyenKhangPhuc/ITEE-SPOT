'use client'

import { createSubmissionRating } from "@/app/actions/submission_ratings"
import { useNotification } from "@/app/context/NotificationContext"
import { ProfileInsert } from "@/app/types/profile"
import { SubmissionRatingInsert } from "@/app/types/submission_rating"
import { User } from "@supabase/supabase-js"
import React, { SetStateAction, useState } from "react"
import { UseFormGetValues } from "react-hook-form"

interface SubmissionRatingProps {
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
    user: ProfileInsert,
    userRating: SubmissionRatingInsert | null
    setUserRating: React.Dispatch<SetStateAction<SubmissionRatingInsert | null>>
}
const SubmissionRating = ({ getValues, user, userRating, setUserRating }: SubmissionRatingProps) => {
    const { showNotification } = useNotification()
    const [chosenStar, setChosenStar] = useState<
        null | 'I definitely want to evaluate this project' | 'I can review this project' | 'I can review this project if needed' | "I would rather not review this project because it’s not my specialty area"
    >(null)
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

            const { data, error } = await createSubmissionRating({ submissionRating: upsertedRating })
            if (error) {
                throw new Error(error)
            }
            setUserRating(upsertedRating)
            showNotification('Give a rating successfully')
        } catch (error) {
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    const handleGettingRatingLevel = (star: number) => {
        switch (star) {
            case 1:
                return 'I would rather not review this project because it’s not my specialty area'
            case 2:
                return 'I would rather not review this project because it’s not my specialty area'
            case 3:
                return 'I can review this project if needed'
            case 4:
                return 'I can review this project'
            case 5:
                return 'I definitely want to evaluate this project'
            default:
                return null
        }
    }
    return (
        <div className="w-full flex flex-col items-start">
            <div className="text-lg font-bold uppercase tracking-tight">Rate the project</div>
            <div className="rating">
                {[5, 4, 3, 2, 1].map((num) => {
                    return <React.Fragment key={`star ${num}`}>
                        <input value={num} name="rate" id={`start${num}`} type="radio" onChange={(e) => handleRating(e.target.value)}
                            checked={userRating?.rating == num}
                        />
                        <label title="text" htmlFor={`start${num}`} onMouseOver={() => setChosenStar(handleGettingRatingLevel(num))}></label>
                    </React.Fragment>
                })}

            </div>
            <div className="text-sm opacity-70">{chosenStar}</div>
        </div>
    )
}

export default SubmissionRating