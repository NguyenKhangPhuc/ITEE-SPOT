'use server'

/**
 * PURPOSE:
 * Fetches all group challenge relations for a specific group ID, including joined event challenges data.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/group_challenge.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing target groupId.
 *   - groupId (string, Required): Unique identifier string of the group.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'group_challenge' filtering by 'group_id',
 * selecting all columns and joining table 'event_challenges'. Returns query payload or error payload.
 *
 * PARAMETERS:
 * - { groupId }: Parameter object containing groupId string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing group challenge relations or error payload.
 */
export async function getGroupChallenges({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('group_challenge')
        .select('*, event_challenges (*)')
        .eq('group_id', groupId)

    return { data, error }
}
