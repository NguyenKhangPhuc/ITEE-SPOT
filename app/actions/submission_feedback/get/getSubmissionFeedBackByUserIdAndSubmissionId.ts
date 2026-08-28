'use client'

/**
 * PURPOSE:
 * Fetches a single feedback entry given a user ID and submission ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_feedback.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing userId and submissionId.
 *   - userId (string, Required): Unique user ID string of feedback provider.
 *   - submissionId (string, Required): Unique submission ID string.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'submission_feedbacks' matching both 'user_id' and 'submission_id'.
 * Returns single feedback payload or error message string if database query fails.
 *
 * PARAMETERS:
 * - { userId, submissionId }: Parameter object with target userId and submissionId strings.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing feedback record or error message string.
 */
export async function getSubmissionFeedBackByUserIdAndSubmissionId({ userId, submissionId }: { userId: string, submissionId: string }) {
    const supabase = createClient();
    const { data, error } = await supabase.from('submission_feedbacks').select('*').eq('user_id', userId).eq('submission_id', submissionId).maybeSingle()
    if (error){
        return {error: "Failed to get the feedbacks"}
    }
    return { data, error }
}
