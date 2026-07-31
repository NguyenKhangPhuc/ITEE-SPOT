'use server'

/**
 * PURPOSE:
 * Inserts a new reaction record for a submission by a specified user.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_reaction.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing submissionId and userId.
 *   - submissionId (string, Required): Unique submission identifier string.
 *   - userId (string, Required): Unique user profile identifier string.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and inserts a new row into table 'submission_reactions' with user_id and submission_id.
 * Returns created reaction payload or error string on failure.
 *
 * PARAMETERS:
 * - { submissionId, userId }: Parameter object holding target submission ID and user ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing reaction data or error message string.
 */
export async function createReaction({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = await createClient();

    const { data, error: reactionError } = await supabase.from('submission_reactions').insert([{
        user_id: userId,
        submission_id: submissionId
    }]).select('*').maybeSingle()

    if (reactionError) {
        return { error: "Fail to create the reaction" }
    }

    return { data, error: reactionError }
}
