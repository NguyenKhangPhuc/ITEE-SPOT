'use client'
import { getSubmissionGradeBasedOnStar, getSubmissionWithGrade, getTop5SubmissionGrade } from "@/app/actions/submissions";
import { updateUserGrading } from "@/app/actions/user_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { SubmissionFinalScore, SubmissionFinalScoreRating } from "@/app/types/submission";
import { UserSubmissionGradeInsert, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade"
import { User } from "@supabase/supabase-js";
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form";

const EventSubmissionGrade = ({ eventCriteria, user, eventId }: { eventCriteria: Array<EventCriteriaInsert>, user: User, eventId: string }) => {
    const [chosenSubmissionGrade, setChosenSubmissionGrade] = useState<string | null>(null)
    const [chosenSubmissionFilter, setChosenSubmissionFilter] = useState<'all' | 'top3' | 'star' | null>(null)
    const [submissionsGroup, setSubmissionGroups] = useState<SubmissionFinalScoreRating | SubmissionFinalScore | null>(null)
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const { register, control, handleSubmit, reset } = useForm<{ grades: Array<UserSubmissionGradeWithPercentage> }>({
        defaultValues: {
            grades: eventCriteria.map((ele) => {
                return {
                    event_criteria_id: ele.id,
                    user_id: user.id,
                    submission_id: null,
                    grade: 50,
                    event_grading_criteria: {
                        percentage: ele.percentage
                    }
                }
            }),
        },
    });
    const gradeValues = useWatch(
        {
            control: control,
            name: 'grades'
        }
    )
    const getALlSubmission = async () => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await getSubmissionWithGrade(eventId)
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch chosen data")
            }
            setIsOpenLoader(false)
            showNotification("Choose successfully")
            setChosenSubmissionFilter('all')
            setSubmissionGroups(data)
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }
    const getTop5Submission = async () => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await getTop5SubmissionGrade(eventId)
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch chosen data")
            }
            setIsOpenLoader(false)
            showNotification("Choose successfully")
            setChosenSubmissionFilter('top3')
            setSubmissionGroups(data)
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const getSubmissionBaseOnStar = async (star: number) => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await getSubmissionGradeBasedOnStar({ eventId, rating: star })
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch chosen data")
            }
            setIsOpenLoader(false)
            showNotification("Choose successfully")
            setChosenSubmissionFilter('star')
            setSubmissionGroups(data)
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleChoosingSubmissionGrade = (items: Array<UserSubmissionGradeInsert>, submissionId: string | null) => {
        if (!submissionId) {
            showNotification("Select unsuccessfully")
            return
        }
        if (items.length != 0) {
            setChosenSubmissionGrade(submissionId)
            reset({ grades: items })
        } else {
            reset({
                grades: eventCriteria.map((ele) => {
                    return {
                        event_criteria_id: ele.id,
                        user_id: user.id,
                        submission_id: submissionId,
                        grade: 50,
                        event_grading_criteria: {
                            percentage: ele.percentage
                        }
                    }
                }),
            })
        }
    }

    const handleCalculateFinalPoints = () => {
        if (!gradeValues || gradeValues.length === 0) return 0;

        const sumOfGrades = gradeValues.reduce((acc, cur) => {
            console.log(cur.grade, "This is grade value + ", cur.event_grading_criteria?.percentage)
            const val = Number(cur.grade) || 0;
            const percentage = cur.event_grading_criteria?.percentage || 0
            return (acc + (val * percentage / 100));
        }, 0);

        return sumOfGrades.toFixed(2)
    }

    const handleSavingSubmissionGrade = async (gradeInfo: { grades: Array<UserSubmissionGradeWithPercentage> }) => {
        setIsOpenLoader(true)
        try {
            if (!chosenSubmissionGrade) {
                throw new Error("Fail to choose the submission grade")
            }
            const removedPercentageGrades: Array<UserSubmissionGradeInsert> = gradeInfo.grades.map((ele, index) => {
                return {
                    event_criteria_id: ele.event_criteria_id,
                    user_id: ele.user_id,
                    submission_id: ele?.submission_id,
                    grade: ele.grade,
                }
            })
            const { data, error, newFinalScore } = await updateUserGrading({ grades: removedPercentageGrades, submissionId: chosenSubmissionGrade })
            if (error) {
                throw new Error
            }
            setIsOpenLoader(false)
            showNotification("Update successfully")
            const updatedSubmissionGroup = submissionsGroup?.map((ele) => {
                console.log(`ele.submission_id ${ele.submission_id} == ${chosenSubmissionGrade} + `)
                if (ele.submission_id == chosenSubmissionGrade && ele.submissions) {
                    ele.final_average_score = newFinalScore?.final_average_score ?? 0
                    ele.submissions.submission_grading = (data ?? [])
                }
                return ele
            })

            if (!updatedSubmissionGroup) {
                throw new Error("Fail to fetch updated grade")
            }
            setSubmissionGroups(updatedSubmissionGroup)
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }

        }
    }

    return (
        <div className="w-full flex flex-col p-5 content-main-color gap-5 mt-5">
            <div className="w-full flex gap-5">
                <button className={`duration-300 cursor-pointer ${chosenSubmissionFilter == 'all' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${chosenSubmissionFilter == 'all' ? 'bg-black' : 'bg-white'} 
                     hover:scale-105 rounded-[10px] flex items-center justify-center `}
                    onClick={() => getALlSubmission()}
                >
                    All Submission Grade
                </button>
                <button className={`duration-300 cursor-pointer ${chosenSubmissionFilter == 'top3' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${chosenSubmissionFilter == 'top3' ? 'bg-black' : 'bg-white'} 
                     hover:scale-105 rounded-[10px] flex items-center justify-center `}
                    onClick={() => getTop5Submission()}
                >
                    Top 5 Submission Grade
                </button>
            </div>
            <select
                defaultValue={""}
                onChange={(e) => getSubmissionBaseOnStar(parseInt(e.target.value))}
                className={`duration-300 cursor-pointer ${chosenSubmissionFilter === 'star' ? 'text-white bg-black' : 'text-black bg-white'
                    } text-center border-4 border-black rounded-[10px] p-3 `}
            >
                <option value="" disabled>
                    Choose an option
                </option>

                <option value="5">Rated 5 Star</option>
                <option value="4">Rated 4 Star</option>
                <option value="3">Rated 3 Star</option>
                <option value="2">Rated 2 Star</option>
                <option value="1">Rated 1 Star</option>
            </select>

            {chosenSubmissionGrade && chosenSubmissionFilter &&
                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit(handleSavingSubmissionGrade)}>
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
                                    <p className="PB-range-slidervalue">{gradeValues[index]?.grade}</p>
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
            }

            {chosenSubmissionFilter && <div className="w-full overflow-x-auto border-4 border-black rounded-[10px] text-sm">
                <table className="w-full min-w-max border-collapse">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-4 border-r border-white border-b-4 border-b-black text-left">Title</th>
                            <th className="p-4 border-r border-white border-b-4 border-b-black text-left">Group Name</th>

                            {eventCriteria.map((criteria) => (
                                <th key={criteria.id} className="p-4 border-r border-white border-b-4 border-b-black text-center">
                                    <div className="flex flex-col">
                                        <span>{criteria.criteria_name}  <span className="text-xs font-normal opacity-70">({criteria.percentage}%)</span></span>

                                    </div>
                                </th>
                            ))}

                            <th className="p-4 border-b-4 border-b-black text-center">Final Grade</th>
                        </tr>
                    </thead>

                    <tbody>
                        {submissionsGroup?.map((item, index) => (
                            <tr key={item.submission_id || index} className="hover:bg-black/50 cursor-pointer duration-300 border-b-2 border-black last:border-b-0"
                                onClick={() => handleChoosingSubmissionGrade(item.submissions?.submission_grading ?? [], item.submission_id)}>
                                <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                    {item.submissions?.title || "No Title"}
                                </td>
                                <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                    {item.submissions?.groups?.group_name || "No group name"}
                                </td>
                                {item.submissions?.submission_grading?.map((criteria) => {


                                    return (
                                        <td key={criteria.id} className="p-4 border-r-2 border-black text-center font-semibold">
                                            {criteria.grade == null ? 'Not graded' : criteria.grade}
                                        </td>
                                    );
                                })}


                                <td className="p-4 text-center font-bold ">
                                    {item.final_average_score?.toFixed(2) ?? "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}

export default EventSubmissionGrade