'use client'

/**
 * PURPOSE:
 * Inserts or updates (upserts) a submission feedback entry in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_feedback.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing submissionFeedback payload.
 *   - submissionFeedback (SubmissionFeedbackInsert, Required): Object containing user_id, submission_id, and feedback content.
 */

import { createClient } from '@/app/utils/supabase/client'
import { SubmissionFeedbackInsert } from '@/app/types/submission_feedback'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and upserts a row into table 'submission_feedbacks' handling conflict on 'user_id, submission_id'.
 * Returns upserted feedback result or error message on failure.
 *
 * PARAMETERS:
 * - { submissionFeedback }: Object payload with feedback fields.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing upsert response payload or error string.
 */
export async function updateSubmissionFeedback({ submissionFeedback }: { submissionFeedback: SubmissionFeedbackInsert }) {
    const supabase = createClient();

    const { data, error } = await supabase.from('submission_feedbacks').upsert(submissionFeedback, { onConflict: 'user_id, submission_id' })

    if (error) {
        return { error: "Cannot create or update the submission feedback" }
    }
    return { data, error }
}
