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
import FilterButton from "./FilterButtons";
import EditSubmissionGrade from "./EditSubmissionGrade";
import GeneralCriteriaTable from "./GeneralCriteriaTable";
import SpecificCriteriaTable from "./SpecificCriteriaTable";

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
                            percentage: ele.percentage,
                            type: CRITERIA_TYPE.NORMAL
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
                            percentage: ele.percentage,
                            type: CRITERIA_TYPE.SPECIFIC
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
            setChosenSubmissionGrade(submissionId)
            console.log(specificCriteria.map((ele) => {
                return {
                    event_criteria_id: ele.id,
                    user_id: user.id,
                    submission_id: submissionId,
                    grade: 50,
                    event_grading_criteria: {
                        percentage: ele.percentage,
                        type: CRITERIA_TYPE.SPECIFIC
                    }
                }

            }),)
            reset({
                normalGrades:
                    normalCriteria.map((ele) => {
                        return {
                            event_criteria_id: ele.id,
                            user_id: user.id,
                            submission_id: submissionId,
                            grade: 50,
                            event_grading_criteria: {
                                percentage: ele.percentage,
                                type: CRITERIA_TYPE.NORMAL
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
                                percentage: ele.percentage,
                                type: CRITERIA_TYPE.SPECIFIC
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
            <FilterButton
                chosenSubmissionFilter={chosenSubmissionFilter}
                getAllSubmission={getALlSubmission}
                getSubmissionBaseOnStar={getSubmissionBaseOnStar}
                getTop5Submsission={getTop5Submission}
            />

            {chosenSubmissionGrade && chosenSubmissionFilter &&
                <EditSubmissionGrade
                    register={register}
                    handleSubmit={handleSubmit}
                    normalCriteria={normalCriteria}
                    specificCriteria={specificCriteria}
                    handleCalculateFinalPoints={handleCalculateFinalPoints}
                    gradesValue={gradesValue}
                    specificGrades={specificGrades}
                    handleSavingSubmissionGrade={handleSavingSubmissionGrade}
                />
            }

            {chosenSubmissionFilter &&
                <div className="w-full flex flex-col gap-10 mt-5">
                    <GeneralCriteriaTable
                        eventCriteria={eventCriteria}
                        normalSubmissionsGroup={normalSubmissionsGroup}
                        handleChoosingSubmissionGrade={handleChoosingSubmissionGrade}
                        chosenSubmissionGrade={chosenSubmissionGrade}
                    />

                    <SpecificCriteriaTable
                        eventCriteria={eventCriteria}
                        specifiSubmissionGroup={specifiSubmissionGroup}
                        handleChoosingSubmissionGrade={handleChoosingSubmissionGrade}
                        chosenSubmissionGrade={chosenSubmissionGrade}
                    />
                </div>
            }
        </div>
    )
}

export default EventSubmissionGrade