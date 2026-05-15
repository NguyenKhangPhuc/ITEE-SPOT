import { CRITERIA_TYPE } from "@/app/types/enum";
import { EventCriteriaInsert } from "@/app/types/event_criteria";
import { SubmissionFinalScore, SubmissionFinalScoreRating } from "@/app/types/submission";
import { UserSubmissionGradeWithPercentage } from "@/app/types/user_submission_grade";

interface GeneralCriteriaTable {
    eventCriteria: Array<EventCriteriaInsert>,
    normalSubmissionsGroup: SubmissionFinalScoreRating | SubmissionFinalScore | null
    handleChoosingSubmissionGrade: (items: UserSubmissionGradeWithPercentage[], submissionId: string | null) => void
    chosenSubmissionGrade: string | null
}
const GeneralCriteriaTable = ({
    eventCriteria,
    normalSubmissionsGroup,
    handleChoosingSubmissionGrade,
    chosenSubmissionGrade }: GeneralCriteriaTable) => {
    return (
        <div className="w-full overflow-x-auto border-4 border-black rounded-[10px] text-sm">
            <div className="text-lg  text-black p-2">Normal Criteria <span className="text-xs font-normal opacity-70">(Total points average)</span></div>
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
                            {(item.submissions?.submission_grading && item.submissions?.submission_grading.length > 0) ?
                                item.submissions?.submission_grading.map((criteria) => {
                                    if (criteria.event_grading_criteria?.type == CRITERIA_TYPE.NORMAL) {
                                        return (
                                            <td key={criteria.id} className="p-4 border-r-2 border-black text-center font-semibold">
                                                {criteria.grade}
                                            </td>
                                        );
                                    }
                                }) : eventCriteria.map((criteria) => {
                                    if (criteria.type == CRITERIA_TYPE.NORMAL) {
                                        return (
                                            <td key={`no grading - ${criteria.id}`} className="p-4 border-r-2 border-black text-center font-semibold">
                                                Not graded
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
    )
}

export default GeneralCriteriaTable