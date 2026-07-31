'use server'

/**
 * PURPOSE:
 * Fetches submission record matching a specific group ID and group challenge relation ID, including associated files, reactions, ratings, and fun facts.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submissions.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing groupId and groupChallengeId.
 *   - groupId (string, Required): Unique identifier of target group.
 *   - groupChallengeId (string, Required): Unique identifier of target group challenge relation.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'submissions' matching group_id and group_challenge_id,
 * selecting joined submission_files, submission_reactions, submission_ratings, and fun_facts.
 *
 * PARAMETERS:
 * - { groupId, groupChallengeId }: Object payload with target group ID and group challenge relation ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing submission record or error message string.
 */
export async function getGoupChallengeSubmission({ groupId, groupChallengeId }: { groupId: string, groupChallengeId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('submissions')
        .select('*, submission_files (*), submission_reactions (*), submission_ratings (*), fun_facts (*)')
        .eq('group_id', groupId)
        .eq('group_challenge_id', groupChallengeId)
        .maybeSingle()

    if (error) {
        return { error: "Fail to get group's submissions" }
    }
    return { data, error }
}
