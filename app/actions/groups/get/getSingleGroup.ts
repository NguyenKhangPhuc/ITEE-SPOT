'use server'

/**
 * PURPOSE:
 * Fetches a single group record by ID including its group members (with profiles) and event details.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/groups.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing groupId.
 *   - groupId (string, Required): Unique identifier of the target group.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'groups' filtering by 'id', joining 'group_members'
 * (with profiles) and 'events'. Returns single group record or error detail.
 *
 * PARAMETERS:
 * - { groupId }: Parameter object containing groupId string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing single group record or error object.
 */
export async function getSingleGroup({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('groups')
        .select('*, group_members (id, profiles (id, email)), events (title, max_group_members)').eq('id', groupId).single();

    return { data, error }
}
