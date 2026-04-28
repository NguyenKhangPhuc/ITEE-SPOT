import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { GradeValue, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

interface EditSubmissionProps {
    register: UseFormRegister<GradeValue>
    handleSubmit: UseFormHandleSubmit<GradeValue, GradeValue>
    normalCriteria: Array<EventCriteriaInsert>,
    specificCriteria: Array<EventCriteriaInsert>,
    handleCalculateFinalPoints: () => string | 0,
    gradesValue: UserSubmissionGradeWithPercentage[],
    specificGrades: UserSubmissionGradeWithPercentage[],
    handleSavingSubmissionGrade: (gradeInfo: GradeValue) => Promise<void>
}
const EditSubmissionGrade = ({
    register,
    handleSubmit,
    normalCriteria,
    specificCriteria,
    handleCalculateFinalPoints,
    gradesValue,
    specificGrades,
    handleSavingSubmissionGrade
}: EditSubmissionProps) => {

    return (
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
    )
}

export default EditSubmissionGrade