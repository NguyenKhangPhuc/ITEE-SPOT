'use client'
import { updateUserGrading } from "@/app/actions/user_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { SubmissionWithEventId } from "@/app/types/submission";
import { UserSubmissionGradeInsert, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";


const SubmissionGradingClient = ({ eventCriteria, submission, user, userGrading }:
    { eventCriteria: Array<EventCriteriaInsert>, submission: SubmissionWithEventId, user: User, userGrading: Array<UserSubmissionGradeWithPercentage> }) => {

    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const { register, control, handleSubmit } = useForm<{ grades: Array<UserSubmissionGradeWithPercentage> }>({
        defaultValues: {
            grades: userGrading.length != 0 ? userGrading : eventCriteria.map((ele) => {
                return {
                    event_criteria_id: ele.id,
                    user_id: user.id,
                    submission_id: submission?.id,
                    grade: 50,
                    event_grading_criteria: {
                        percentage: ele.percentage
                    }
                }
            }),
        },
    });
    const gradesValue = useWatch({
        name: 'grades',
        control: control
    })
    const handleCalculateFinalPoints = () => {
        if (!gradesValue || gradesValue.length === 0) return 0;
        console.log(gradesValue, eventCriteria)
        const sumOfGrades = gradesValue.reduce((acc, cur) => {
            const val = Number(cur.grade) || 0;
            const percentage = cur.event_grading_criteria?.percentage || 0
            return (acc + (val * percentage / 100));
        }, 0);

        return sumOfGrades.toFixed(2)
    }

    const handleGiveGrade = async (data: { grades: Array<UserSubmissionGradeInsert> }) => {
        setIsOpenLoader(true)
        try {
            const removedPercentageGrades: Array<UserSubmissionGradeInsert> = gradesValue.map((ele, index) => {
                return {
                    event_criteria_id: ele.event_criteria_id,
                    user_id: ele.user_id,
                    submission_id: ele?.submission_id,
                    grade: ele.grade,
                }
            })
            const { error } = await updateUserGrading({ grades: removedPercentageGrades })
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
                {eventCriteria.map((field, index) => {

                    return (
                        <div key={field.id} className="w-full flex flex-col items-start gap-2">
                            <div className="w-full flex justify-between items-center">
                                <h3 className="font-semibold text-lg text-gray-800">
                                    {field.criteria_name}
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
                                    {...register(`grades.${index}.grade`, { valueAsNumber: true })}
                                />
                                <p className="PB-range-slidervalue">{gradesValue[index]?.grade}</p>
                            </div>
                        </div>
                    );
                })}

                <div className="w-full flex justify-center items-center font-bold">
                    Final grade: {handleCalculateFinalPoints()}/100
                </div>

                <button
                    type="submit"
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-black/80 duration-300 cursor-pointer"
                >
                    Give your grade
                </button>
            </form>
        </div>
    )
}

export default SubmissionGradingClient