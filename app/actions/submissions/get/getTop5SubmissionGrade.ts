'use client'

/**
 * PURPOSE:
 * Fetches top 5 highest graded submission score records for a user in a specific event.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submissions.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing eventId and userId.
 *   - eventId (string, Required): Target event ID string.
 *   - userId (string, Required): Evaluator user ID string.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Queries view 'submission_final_scores' ordered by final_average_score descending, limited to 5 records,
 * filtering by event_id and user_id.
 *
 * PARAMETERS:
 * - { eventId, userId }: Object payload containing event ID and user ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing top 5 graded submissions or error message.
 */
export async function getTop5SubmissionGrade({ eventId, userId }: { eventId: string, userId: string }) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('submission_final_scores')
        .select('*, submissions!inner (*, groups!inner (id,group_name, event_id), submission_grading (*, event_grading_criteria (percentage, type)))')
        .order('type', { referencedTable: 'submissions.submission_grading.event_grading_criteria', ascending: true })
        .order('event_criteria_id', { referencedTable: 'submissions.submission_grading', ascending: false })
        .order('final_average_score', { ascending: false })
        .limit(5)
        .eq('submissions.groups.event_id', eventId)
        .eq('submissions.submission_grading.user_id', userId)
    if (error) {
        return { error: "Fail to fetch top 3 submission grade" }
    }
    return { data, error }
}
