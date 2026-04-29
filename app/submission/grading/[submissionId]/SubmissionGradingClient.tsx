'use client'
import { updateSubmissionFeedback } from "@/app/actions/submission_feedback";
import { updateUserGrading } from "@/app/actions/user_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { CRITERIA_TYPE, PROFILE_ROLE } from "@/app/types/enum";
import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { Profile } from "@/app/types/profile";
import { SubmissionWithEventId } from "@/app/types/submission";
import { SubmissionFeedback, SubmissionFeedbackInsert } from "@/app/types/submission_feedback";
import { UserSubmissionGradeInsert, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import FeedbackSection from "./FeedbackSection";
import GeneralCriteriaSection from "./GeneralCriteriaSection";
import SpecificCriteriaSection from "./SpecificCriteriaSection";


interface GradeValue {
    normalGrades: Array<UserSubmissionGradeWithPercentage>,
    specificGrades: Array<UserSubmissionGradeWithPercentage>
}

const SubmissionGradingClient = ({ eventCriteria, submission, user, userGrading, userSubmissionFeedback }:
    {
        eventCriteria: Array<EventCriteriaInsert>, submission: SubmissionWithEventId, user: Profile, userGrading: Array<UserSubmissionGradeWithPercentage>,
        userSubmissionFeedback: SubmissionFeedback | null
    }) => {
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const normalCriteria = eventCriteria.filter((ele) => ele.type == CRITERIA_TYPE.NORMAL)
    const specificCriteria = eventCriteria.filter((ele) => ele.type == CRITERIA_TYPE.SPECIFIC)
    const { register, control, handleSubmit } = useForm<GradeValue>({
        defaultValues: {
            normalGrades: userGrading.length != 0 ? userGrading.filter((ele) => {
                return ele.event_grading_criteria?.type == CRITERIA_TYPE.NORMAL
            })
                :
                normalCriteria.map((ele) => {
                    return {
                        event_criteria_id: ele.id,
                        user_id: user.id,
                        submission_id: submission?.id,
                        grade: 50,
                        event_grading_criteria: {
                            percentage: ele.percentage,
                            type: ele.type
                        }
                    }

                }),
            specificGrades: userGrading.length != 0 ? userGrading.filter((ele) => {
                return ele.event_grading_criteria?.type == CRITERIA_TYPE.SPECIFIC
            })
                :
                specificCriteria.map((ele) => {
                    return {
                        event_criteria_id: ele.id,
                        user_id: user.id,
                        submission_id: submission?.id,
                        grade: 50,
                        event_grading_criteria: {
                            percentage: ele.percentage,
                            type: ele.type
                        }
                    }

                }),

        },
    });

    const gradesValue = useWatch({
        name: 'normalGrades',
        control: control
    })
    const specificGrades = useWatch({
        name: 'specificGrades',
        control: control
    })
    const handleCalculateFinalPoints = () => {
        if (!gradesValue || gradesValue.length === 0) return 0;
        const sumOfGrades = gradesValue.reduce((acc, cur) => {
            if (cur.event_grading_criteria?.type == CRITERIA_TYPE.NORMAL) {
                const val = Number(cur.grade) || 0;
                const percentage = cur.event_grading_criteria?.percentage || 0

                return (acc + (val * percentage / 100));
            }
            return acc + 0
        }, 0);

        return sumOfGrades.toFixed(2)
    }

    const handleGiveGrade = async (data: GradeValue) => {
        setIsOpenLoader(true)
        try {
            const combinedGrade = [...data.normalGrades, ...data.specificGrades]
            const removedPercentageGrades: Array<UserSubmissionGradeInsert> = combinedGrade.map((ele, index) => {
                return {
                    event_criteria_id: ele.event_criteria_id,
                    user_id: ele.user_id,
                    submission_id: ele?.submission_id,
                    grade: ele.grade,
                }
            })
            const { error } = await updateUserGrading({ grades: removedPercentageGrades, submissionId: submission?.id ?? "" })
            if (error) {
                throw new Error(error)
            }
            showNotification("Give grade successfully")
            setIsOpenLoader(false)
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    return (
        <div className="w-full flex flex-col p-5 shadow-xl/30 rounded-xl bg-white border border-gray-100 mt-5">
            <form onSubmit={handleSubmit(handleGiveGrade)} className="space-y-8">
                <GeneralCriteriaSection
                    register={register}
                    normalCriteria={normalCriteria}
                    handleCalculateFinalPoints={handleCalculateFinalPoints}
                    gradesValue={gradesValue}
                />

                <SpecificCriteriaSection
                    register={register}
                    specificCriteria={specificCriteria}
                    specificGrades={specificGrades}
                />
                <button
                    type="submit"
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-black/80 duration-300 cursor-pointer"
                >
                    Submit your points
                </button>
            </form>
            <FeedbackSection user={user} submission={submission} userSubmissionFeedback={userSubmissionFeedback} />
        </div>
    )
}

export default SubmissionGradingClient