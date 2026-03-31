'use client'
import { getSubmissionGradeBasedOnStar, getSubmissionWithGrade, getTop5SubmissionGrade } from "@/app/actions/submissions";
import { updateUserGrading } from "@/app/actions/user_grading";
import { useLoader } from "@/app/context/LoaderContext";
import { useNotification } from "@/app/context/NotificationContext";
import { CRITERIA_TYPE } from "@/app/types/enum";
import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { SubmissionFinalScore, SubmissionFinalScoreRating } from "@/app/types/submission";
import { UserSubmissionGradeInsert, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade"
import { User } from "@supabase/supabase-js";
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form";

interface GradeValue {
    normalGrades: Array<UserSubmissionGradeWithPercentage>,
    specificGrades: Array<UserSubmissionGradeWithPercentage>
}

const EventSubmissionGrade = ({ eventCriteria, user, eventId }: { eventCriteria: Array<EventCriteriaInsert>, user: User, eventId: string }) => {
    const normalCriteria = eventCriteria.filter((ele) => ele.type == CRITERIA_TYPE.NORMAL)
    const specificCriteria = eventCriteria.filter((ele) => ele.type == CRITERIA_TYPE.SPECIFIC)
    const [chosenSubmissionGrade, setChosenSubmissionGrade] = useState<string | null>(null)
    const [chosenSubmissionFilter, setChosenSubmissionFilter] = useState<'all' | 'top3' | 'star' | null>(null)
    const [normalSubmissionsGroup, setNormalSubmissionGroups] = useState<SubmissionFinalScoreRating | SubmissionFinalScore | null>(null)
    const [specifiSubmissionGroup, setSpecificSubmissionGroups] = useState<SubmissionFinalScoreRating | SubmissionFinalScore | null>(null)
    const { showNotification } = useNotification()
    const { setIsOpenLoader } = useLoader()
    const { register, control, handleSubmit, reset } = useForm<GradeValue>({
        defaultValues: {
            normalGrades:
                normalCriteria.map((ele) => {
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
            specificGrades:
                specificCriteria.map((ele) => {
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
    const getALlSubmission = async () => {
        setIsOpenLoader(true)
        try {
            const { data, error } = await getSubmissionWithGrade({ eventId, userId: user.id })
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch chosen data")
            }
            setIsOpenLoader(false)
            showNotification("Choose successfully")
            setChosenSubmissionFilter('all')
            setNormalSubmissionGroups(data)
            setSpecificSubmissionGroups(data)
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
            const { data, error } = await getTop5SubmissionGrade({ eventId, userId: user.id })
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch chosen data")
            }
            setIsOpenLoader(false)
            showNotification("Choose successfully")
            setChosenSubmissionFilter('top3')
            setNormalSubmissionGroups(data)
            setSpecificSubmissionGroups(data)
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
            const { data, error } = await getSubmissionGradeBasedOnStar({ eventId, rating: star, userId: user.id })
            if (error) {
                throw new Error(error)
            }
            if (!data) {
                throw new Error("Fail to fetch chosen data")
            }
            setIsOpenLoader(false)
            showNotification("Choose successfully")
            setChosenSubmissionFilter('star')
            setNormalSubmissionGroups(data)
            setSpecificSubmissionGroups(data)
        } catch (error) {
            setIsOpenLoader(false)
            if (error instanceof Error) {
                showNotification(error.message)
            }
        }
    }

    const handleChoosingSubmissionGrade = (items: Array<UserSubmissionGradeWithPercentage>, submissionId: string | null) => {
        console.log(items)
        if (!submissionId) {
            showNotification("Select unsuccessfully")
            return
        }
        if (items.length != 0) {
            setChosenSubmissionGrade(submissionId)
            const normalGradeCriteria = items.filter((ele) => ele.event_grading_criteria?.type == CRITERIA_TYPE.NORMAL)
            const specificGradeCriteria = items.filter((ele) => ele.event_grading_criteria?.type == CRITERIA_TYPE.SPECIFIC)
            reset({ normalGrades: normalGradeCriteria, specificGrades: specificGradeCriteria })
        } else {
            reset({
                normalGrades:
                    normalCriteria.map((ele) => {
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
                specificGrades:
                    specificCriteria.map((ele) => {
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
    const handleSavingSubmissionGrade = async (gradeInfo: GradeValue) => {
        setIsOpenLoader(true)
        try {
            if (!chosenSubmissionGrade) {
                throw new Error("Fail to choose the submission grade")
            }
            const combinedGrade = [...gradeInfo.normalGrades, ...gradeInfo.specificGrades]
            const removedPercentageGrades: Array<UserSubmissionGradeInsert> = combinedGrade.map((ele, index) => {
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
            const updatedSubmissionGroup = normalSubmissionsGroup?.map((ele) => {
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
            setNormalSubmissionGroups(updatedSubmissionGroup)
            setSpecificSubmissionGroups(updatedSubmissionGroup)
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
                    All Evaluation Result
                </button>
                <button className={`duration-300 cursor-pointer ${chosenSubmissionFilter == 'top3' ? 'text-white' : 'text-black'} 
                     p-5 text-center w-1/2 h-13 border-4 border-black ${chosenSubmissionFilter == 'top3' ? 'bg-black' : 'bg-white'} 
                     hover:scale-105 rounded-[10px] flex items-center justify-center `}
                    onClick={() => getTop5Submission()}
                >
                    Top 5 Evaluation Result
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


                                    <div className="PB-range-slider-div w-full border">
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


                                    <div className="PB-range-slider-div w-full border">
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
            }

            {chosenSubmissionFilter &&
                <div className="w-full flex flex-col gap-10 mt-5">
                    <div className="w-full overflow-x-auto border-4 border-black rounded-[10px] text-sm">
                        <div className="text-lg  text-black p-2">Normal Criteria</div>
                        <table className="w-full min-w-max border-collapse">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="w-60  p-4 border-r border-white border-b-4 border-b-black text-left">Title</th>
                                    <th className="w-60  p-4 border-r border-white border-b-4 border-b-black text-left">Group Name</th>
                                    <th className="w-20 p-1 border-r border-white border-b-4 border-b-black text-center">Total Grader</th>
                                    {eventCriteria.map((criteria) => {
                                        if (criteria.type == CRITERIA_TYPE.NORMAL) {
                                            return (
                                                <th key={criteria.id} className="p-4 border-r border-white border-b-4 border-b-black text-center">
                                                    <div className="flex flex-col">
                                                        <span>{criteria.criteria_name}  <span className="text-xs font-normal opacity-70">({criteria.percentage}%)</span></span>

                                                    </div>
                                                </th>
                                            )
                                        }
                                    })}

                                    <th className="p-4 border-b-4 border-b-black text-center">Total points (average)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {normalSubmissionsGroup?.map((item, index) => (
                                    <tr key={item.submission_id || index} className={`hover:bg-black/50 cursor-pointer duration-300 border-b-2 border-black last:border-b-0 ${chosenSubmissionGrade == item.submission_id && 'bg-black/40'}`}
                                        onClick={() => handleChoosingSubmissionGrade(item.submissions?.submission_grading ?? [], item.submission_id)}>
                                        <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                            {item.submissions?.title || "No Title"}
                                        </td>
                                        <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                            {item.submissions?.groups?.group_name || "No group name"}
                                        </td>
                                        <td className="p-1 border-r-2 border-black  font-semibold text-sm text-center">
                                            {item.total_graders}
                                        </td>
                                        {item.submissions?.submission_grading?.map((criteria) => {
                                            if (criteria.event_grading_criteria?.type == CRITERIA_TYPE.NORMAL) {
                                                return (
                                                    <td key={criteria.id} className="p-4 border-r-2 border-black text-center font-semibold">
                                                        {criteria.grade == null ? 'Not graded' : criteria.grade}
                                                    </td>
                                                );
                                            }
                                        })}


                                        <td className="p-4 text-center font-bold ">
                                            {item.final_average_score?.toFixed(2) ?? "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-full overflow-x-auto border-4 border-black rounded-[10px] text-sm">
                        <div className="text-lg text-black p-2">Specific Criteria</div>
                        <table className="w-full min-w-max border-collapse">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="w-60 p-4 border-r border-white border-b-4 border-b-black text-left">Title</th>
                                    <th className="w-60 p-4 border-r border-white border-b-4 border-b-black text-left">Group Name</th>
                                    <th className="w-20 border-r border-white border-b-4 border-b-black text-center">Total Grader</th>
                                    {eventCriteria.map((criteria) => {
                                        if (criteria.type == CRITERIA_TYPE.SPECIFIC) {
                                            return (
                                                <th key={criteria.id} className="p-4 border-r border-white border-b-4 border-b-black text-center">
                                                    <div className="flex flex-col">
                                                        <span>{criteria.criteria_name}  <span className="text-xs font-normal opacity-70">({criteria.percentage}%)</span></span>

                                                    </div>
                                                </th>
                                            )
                                        }
                                    })}

                                </tr>
                            </thead>

                            <tbody>
                                {specifiSubmissionGroup?.map((item, index) => (
                                    <tr key={item.submission_id || index} className={`hover:bg-black/50  cursor-pointer duration-300 border-b-2 border-black last:border-b-0 ${chosenSubmissionGrade == item.submission_id ? 'bg-black/40' : 'bg-gray-200'}`}
                                        onClick={() => handleChoosingSubmissionGrade(item.submissions?.submission_grading ?? [], item.submission_id)}>
                                        <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                            {item.submissions?.title || "No Title"}
                                        </td>
                                        <td className="p-4 border-r-2 border-black  font-semibold text-sm">
                                            {item.submissions?.groups?.group_name || "No group name"}
                                        </td>
                                        <td className="p-1 border-r-2 border-black  font-semibold text-sm text-center">
                                            {item.total_graders}
                                        </td>
                                        {item.submissions?.submission_grading?.map((criteria) => {
                                            if (criteria.event_grading_criteria?.type == CRITERIA_TYPE.SPECIFIC) {
                                                return (
                                                    <td key={criteria.id} className="p-4 border-r-2 border-black text-center font-semibold">
                                                        {criteria.grade == null ? 'Not graded' : criteria.grade}
                                                    </td>
                                                );
                                            }
                                        })}

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>



            }
        </div>
    )
}

export default EventSubmissionGrade