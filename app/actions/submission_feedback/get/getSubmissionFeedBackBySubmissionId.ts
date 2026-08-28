'use client'

/**
 * PURPOSE:
 * Fetches all feedback entries for a specific submission ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_feedback.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing submissionId.
 *   - submissionId (string, Required): Unique identifier of target submission.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'submission_feedbacks' filtering by 'submission_id'.
 *
 * PARAMETERS:
 * - { submissionId }: Parameter object with target submissionId string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing submission feedbacks array or error payload.
 */
export async function getSubmissionFeedBackBySubmissionId({ submissionId }: { submissionId: string }) {
    const supabase = createClient()
    const { data, error } = await supabase.from('submission_feedbacks').select('*').eq('submission_id', submissionId)
    return { data, error }
}
