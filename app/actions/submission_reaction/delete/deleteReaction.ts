'use client'

/**
 * PURPOSE:
 * Deletes a reaction record matching a specific submission ID and user ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_reaction.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing submissionId and userId.
 *   - submissionId (string, Required): Target submission ID string.
 *   - userId (string, Required): Target user ID string.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and deletes the matching row in table 'submission_reactions' where submission_id and user_id match.
 *
 * PARAMETERS:
 * - { submissionId, userId }: Parameter object holding submission ID and user ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing deletion result payload or error message string.
 */
export async function deleteReaction({ submissionId, userId }: { submissionId: string, userId: string }) {
    const supabase = createClient()

    const { data, error } = await supabase.from('submission_reactions').delete().eq('submission_id', submissionId).eq('user_id', userId)

    if (error) {
        return { error: "Fail to delete the reaction" }
    }

    return { data, error }
}
