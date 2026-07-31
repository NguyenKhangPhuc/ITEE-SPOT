'use server'

/**
 * PURPOSE:
 * Fetches all submission entries belonging to a specified group ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submissions.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing groupId.
 *   - groupId (string, Required): Unique identifier of target group.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'submissions' filtering by 'group_id',
 * selecting group_challenge (event_challenges), submission_files, submission_reactions, submission_ratings, and fun_facts.
 *
 * PARAMETERS:
 * - { groupId }: Parameter object containing groupId string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing submissions array or error payload.
 */
export async function getSubmissionByGroupId({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('submissions')
        .select('*, group_challenge (id, event_challenges (company_name, title)), submission_files (*), submission_reactions (*), submission_ratings (*), fun_facts (*)')
        .eq('group_id', groupId)
    return { data, error }
}
