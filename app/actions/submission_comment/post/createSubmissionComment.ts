'use client'

/**
 * PURPOSE:
 * Inserts a new comment entry for a submission into the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_comment.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - submissionComment (SubmissionCommentInsert, Required): Object payload containing submission comment details.
 */

import { createClient } from '@/app/utils/supabase/client'
import { SubmissionCommentInsert } from '@/app/types/submission_comments'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and inserts the provided SubmissionCommentInsert row into 'submission_comments'.
 * Returns inserted comment record payload or error message on failure.
 *
 * PARAMETERS:
 * - submissionComment (SubmissionCommentInsert): Comment object payload to insert.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing created comment data or error message string.
 */
export async function createSubmissionComment(submissionComment: SubmissionCommentInsert) {
    const supabase = createClient();

    const { data, error } = await supabase.from('submission_comments').insert(submissionComment).select('*').maybeSingle()
    if (error) {
        return { error: "Failed to create the comment" }
    }

    return { data, error }
}
