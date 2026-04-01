import { Database } from "./database.types";

export type UserSubmissionGrade = Database["public"]["Tables"]['submission_grading']["Row"]

export type UserSubmissionGradeInsert = Database["public"]["Tables"]["submission_grading"]["Insert"]

export interface UserSubmissionGradeWithPercentage extends UserSubmissionGradeInsert {
    event_grading_criteria: {
        percentage: number | null,
        type: 'normal' | 'specific' | null
    } | null
}
