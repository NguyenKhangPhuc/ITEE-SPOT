'use server'

/**
 * PURPOSE:
 * Fetches all reaction entries associated with a specific submission ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submission_reaction.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing submissionId.
 *   - submissionId (string, Required): Unique identifier of target submission.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'submission_reactions' filtering by 'submission_id'.
 * Returns reaction list records array or error object.
 *
 * PARAMETERS:
 * - { submissionId }: Parameter object containing submissionId string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing submission reactions payload or error detail.
 */
export async function getSubmissionReactions({ submissionId }: { submissionId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('submission_reactions').select('*').eq('submission_id', submissionId)

    return { data, error }
}
