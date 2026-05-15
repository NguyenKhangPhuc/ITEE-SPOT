import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { GradeValue, UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade";
import { register } from "module";
import { UseFormRegister } from "react-hook-form";

interface SpecificCriteriaSectionProps {
    specificCriteria: Array<EventCriteriaInsert>,
    register: UseFormRegister<GradeValue>,
    specificGrades: UserSubmissionGradeWithPercentage[]
}

const SpecificCriteriaSection = ({ specificCriteria, register, specificGrades }: SpecificCriteriaSectionProps) => {
    return (
        <>
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
        </>
    )
}

export default SpecificCriteriaSection