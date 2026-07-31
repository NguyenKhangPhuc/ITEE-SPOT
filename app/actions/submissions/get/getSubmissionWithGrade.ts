'use server'

/**
 * PURPOSE:
 * Fetches all submission final score records and detailed criteria grading for a user in a specific event.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submissions.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing eventId and userId.
 *   - eventId (string, Required): Target event ID string.
 *   - userId (string, Required): Evaluator user ID string.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Queries view 'submission_final_scores' joining submissions (groups, submission_grading, event_grading_criteria),
 * filtering by event_id and user_id, ordering by criteria type, event_criteria_id, and final_average_score.
 *
 * PARAMETERS:
 * - { eventId, userId }: Object payload containing target event ID and user ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing submission grade records or error message string.
 */
export async function getSubmissionWithGrade({ eventId, userId }: { eventId: string, userId: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('submission_final_scores')
        .select('*, submissions!inner (*, groups!inner (id,group_name, event_id), submission_grading (*, event_grading_criteria (percentage, type)))')
        .order('type', { referencedTable: 'submissions.submission_grading.event_grading_criteria', ascending: true })
        .order('event_criteria_id', { referencedTable: 'submissions.submission_grading', ascending: false })
        .order('final_average_score', { ascending: false })
        .eq('submissions.groups.event_id', eventId)
        .eq('submissions.submission_grading.user_id', userId)
    if (error) {
        return { error: "Fail to fetch all submission grade" }
    }
    return { data, error }
}
