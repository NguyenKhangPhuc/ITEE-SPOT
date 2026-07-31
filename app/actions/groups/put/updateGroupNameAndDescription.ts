'use server'

/**
 * PURPOSE:
 * Updates the name and short description of an existing group record.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/groups.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing groupId, groupName, and description.
 *   - groupId (string, Required): Unique ID of the target group.
 *   - groupName (string, Required): New name string for the group.
 *   - description (string, Required): New short description string for the group.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and updates table 'groups' setting group_name and short_description
 * for matching groupId. Returns updated group record or error string on failure.
 *
 * PARAMETERS:
 * - { groupId, groupName, description }: Parameter object holding target group ID, new name, and description.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing updated record payload or error message.
 */
export async function updateGroupNameAndDescription({ groupId, groupName, description }: { groupId: string, groupName: string, description: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('groups').update({ group_name: groupName, short_description: description }).eq('id', groupId).select().maybeSingle();
    if (error) {
        return { error: "Fail to update the group information" }
    }
    return { data, error }
}
