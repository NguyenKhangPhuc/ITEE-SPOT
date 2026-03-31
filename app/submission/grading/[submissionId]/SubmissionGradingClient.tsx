'use client'
import { updateUserGrading } from "@/app/actions/user_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { CRITERIA_TYPE } from "@/app/types/enum";
import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { SubmissionWithEventId } from "@/app/types/submission";
import { UserSubmissionGradeInsert, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";


interface GradeValue {
    normalGrades: Array<UserSubmissionGradeWithPercentage>,
    specificGrades: Array<UserSubmissionGradeWithPercentage>
}

const SubmissionGradingClient = ({ eventCriteria, submission, user, userGrading }:
    { eventCriteria: Array<EventCriteriaInsert>, submission: SubmissionWithEventId, user: User, userGrading: Array<UserSubmissionGradeWithPercentage> }) => {
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
    console.log(gradesValue, specificGrades)
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
    console.log(specificCriteria)

    return (
        <div className="w-full flex flex-col p-5 shadow-xl/30 rounded-xl bg-white border border-gray-100 mt-5">
            <form onSubmit={handleSubmit(handleGiveGrade)} className="space-y-8">
                {normalCriteria
                    .map((field, index) => {


                        return (
                            <div key={field.id} className="w-full flex flex-col items-start gap-2">
                                <div className="w-full flex justify-between items-center">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {field.criteria_name}
                                        <div className="text-sm opacity-70">
                                            Type: {field.type}
                                        </div>
                                    </h3>
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {field.percentage}%
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 opacity-70 flex flex-wrap break-all">
                                    {field.criteria_description}
                                </p>


                                <div className="PB-range-slider-div w-full border-4">
                                    <input type="range" min="1" max="100" className="PB-range-slider" id="myRange"
                                        {...register(`normalGrades.${index}.grade`, { valueAsNumber: true })}
                                    />
                                    <p className="PB-range-slidervalue">{gradesValue[index]?.grade}</p>
                                </div>
                            </div>
                        );

                    })}

                <div className="w-full flex justify-center items-center font-bold">
                    Total points: {handleCalculateFinalPoints()}/100
                </div>

                {specificCriteria
                    .map((field, index) => {


                        return (
                            <div key={field.id} className="w-full flex flex-col items-start gap-2">
                                <div className="w-full flex justify-between items-center">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {field.criteria_name}
                                        <div className="text-sm opacity-70">
                                            Type: {field.type}
                                        </div>
                                    </h3>
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {field.percentage}%
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 opacity-70 flex flex-wrap break-all">
                                    {field.criteria_description}
                                </p>


                                <div className="PB-range-slider-div w-full">
                                    <input type="range" min="0" max="100" className="PB-range-slider" id="myRange"
                                        {...register(`specificGrades.${index}.grade`, { valueAsNumber: true })}
                                    />
                                    <p className="PB-range-slidervalue">{specificGrades[index]?.grade}</p>
                                </div>
                            </div>
                        );

                    })}
                <button
                    type="submit"
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-black/80 duration-300 cursor-pointer"
                >
                    Submit your points
                </button>
            </form>
        </div>
    )
}

export default SubmissionGradingClient