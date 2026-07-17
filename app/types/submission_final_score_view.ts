import { Database } from "./database.types";
import { SubmissionRatingInsert } from "./submission_rating";
export type RawRow = Database['public']['Views']['submission_final_scores']['Row'];

export interface CriteriaGrader {
    user_id: string;
    user_name: string | null;
    grade: number;
    weighted_score: number;
}

export interface CriteriaCell {
    criteria_id: string;
    criteria_name: string | null;
    avg_score: number | null;
    graders: CriteriaGrader[];
}

export interface SubmissionRater {
    user_id: string;
    user_name: string | null;
    rating: number;
}

export interface SubmissionFinalScore {
    submission_id: string | null;
    group_id: string | null;
    group_name: string | null;
    submission_title: string | null;
    event_id: string | null;
    final_avg_score: number | null;
    normal_criteria: CriteriaCell[];
    specific_criteria: CriteriaCell[];
    avg_rating: number | null;
    total_raters: number | null;
    raters: SubmissionRater[];
}

export type SubmissionFinalScoresResponse = SubmissionFinalScore[];