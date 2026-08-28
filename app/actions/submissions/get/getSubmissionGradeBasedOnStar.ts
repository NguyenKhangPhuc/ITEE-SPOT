'use client'

/**
 * PURPOSE:
 * Fetches submission final scores filtered by rating star value for a user in a specific event.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submissions.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing eventId, rating, and userId.
 *   - eventId (string, Required): Target event ID string.
 *   - rating (number, Required): Target rating star integer value.
 *   - userId (string, Required): Target user ID string of the evaluator.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Queries view 'submission_final_scores' joining submissions, groups, submission_grading, and submission_ratings
 * filtering by rating, user_id, and event_id, ordering results by criteria type, criteria_id, and final score.
 *
 * PARAMETERS:
 * - { eventId, rating, userId }: Object payload containing event ID, rating integer, and user ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing graded submissions data or error message string.
 */
export async function getSubmissionGradeBasedOnStar({ eventId, rating, userId }: { eventId: string, rating: number, userId: string }) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('submission_final_scores')
        .select('*, submissions!inner (*, groups!inner (id,group_name, event_id), submission_grading (*, event_grading_criteria (percentage, type)), submission_ratings!inner (id, rating))')
        .order('type', { referencedTable: 'submissions.submission_grading.event_grading_criteria', ascending: true })
        .order('event_criteria_id', { referencedTable: 'submissions.submission_grading', ascending: false })
        .order('final_average_score', { ascending: false })
        .eq('submissions.submission_ratings.rating', rating)
        .eq('submissions.submission_ratings.user_id', userId)
        .eq('submissions.groups.event_id', eventId)
        .eq('submissions.submission_grading.user_id', userId)
    if (error) {
        return { error: "Fail to fetch 5 stare submission grade" }
    }

    return { data, error }
}
