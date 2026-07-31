'use server'

/**
 * PURPOSE:
 * Deletes a group member record by its unique ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/group_member.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - id (string, Required): Unique ID string of the group_members record to delete.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and deletes the matching row from 'group_members' table using the provided record ID.
 * Returns operation result data or error message string.
 *
 * PARAMETERS:
 * - id (string): Target group member record ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing operation response or error message string.
 */
export async function deleteGroupMemberById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('group_members').delete().eq('id', id)
    if (error) {
        return { error: 'Fail to delete the group member' }
    }
    return { data, error }
}
