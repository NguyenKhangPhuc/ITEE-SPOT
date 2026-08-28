'use client'

/**
 * PURPOSE:
 * Updates or inserts user criterion scores for a submission and returns the recalculated final submission score.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/user_grading.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing grades list and submissionId.
 *   - grades (Array<UserSubmissionGradeInsert>, Required): List of criterion grading inserts to upsert.
 *   - submissionId (string, Required): Target submission ID string.
 */

import { createClient } from '@/app/utils/supabase/client'
import { UserSubmissionGradeInsert } from '@/app/types/user_submission_grade'

/**
 * BEHAVIORAL MECHANISM:
 * Upserts grade entries into table 'submission_grading' handling conflict on 'user_id, submission_id, event_criteria_id',
 * then queries table 'submission_final_scores' for the updated submission_id to fetch the newly calculated final score.
 *
 * PARAMETERS:
 * - { grades, submissionId }: Parameter object containing grades array and submission ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any, newFinalScore?: any }>: Object containing updated grades, new final score payload, or error message string.
 */
export async function updateUserGrading({ grades, submissionId }: { grades: Array<UserSubmissionGradeInsert>, submissionId: string }) {
    const supabase = createClient();
    const { data, error } = await supabase.from('submission_grading')
        .upsert(grades, { onConflict: 'user_id, submission_id, event_criteria_id' }).select('*, event_grading_criteria (percentage, type)')
        .order('event_criteria_id', { ascending: false })
    if (error) {
        return { error: "Failed to update the grade" }
    }
    const { data: newFinalScore, error: finalScoreError } = await supabase.from('submission_final_scores').select('*').eq('submission_id', submissionId).single();
    if (finalScoreError) {
        return { error: 'Fail to fetch new final score, please reload' }
    }
    return { data, error, newFinalScore }
}
