'use server'

/**
 * PURPOSE:
 * Fetches all criteria grading entries submitted by a specific user for a given submission ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/user_grading.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing userId and submissionId.
 *   - userId (string, Required): Unique user ID string of evaluator.
 *   - submissionId (string, Required): Unique target submission ID string.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'submission_grading' matching 'submission_id' and 'user_id',
 * joining 'event_grading_criteria' (percentage, type), ordered by 'event_criteria_id' descending.
 *
 * PARAMETERS:
 * - { userId, submissionId }: Parameter object containing user ID and submission ID.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing grading records array or error payload.
 */
export async function getUserGradingForSubmissionById({ userId, submissionId }: { userId: string, submissionId: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('submission_grading')
        .select('*, event_grading_criteria!inner (percentage, type)')
        .eq('submission_id', submissionId)
        .eq('user_id', userId)
        .order('event_criteria_id', { ascending: false })
    return { data, error }
}
