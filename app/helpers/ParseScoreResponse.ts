import { Json } from "../types/database.types";
import { CriteriaCell, RawRow, SubmissionFinalScore, SubmissionRater } from "../types/submission_final_score_view";

function mapCriteriaCells(json: Json): CriteriaCell[] {
  if (!Array.isArray(json)) return [];
  return json as unknown as CriteriaCell[];
}

function mapRaters(json: Json): SubmissionRater[] {
  if (!Array.isArray(json)) return [];
  return json as unknown as SubmissionRater[];
}

export function mapSubmissionFinalScore(row: RawRow): SubmissionFinalScore {
  return {
    submission_id: row.submission_id!,
    submission_title: row.submission_title,
    group_id: row.group_id!,
    group_name: row.group_name,
    event_id: row.event_id!,
    final_avg_score: row.final_avg_score,
    normal_criteria: mapCriteriaCells(row.normal_criteria),
    specific_criteria: mapCriteriaCells(row.specific_criteria),
    avg_rating: row.avg_rating,
    total_raters: row.total_raters,
    raters: mapRaters(row.raters),
  };
}
