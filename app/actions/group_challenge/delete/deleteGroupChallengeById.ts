'use client'

/**
 * PURPOSE:
 * Deletes a group challenge relation entry by its unique ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/group_challenge.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - groupChallengeId (string, Required): The unique ID of the group challenge relation to delete.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes a delete operation on table 'group_challenge' matching 'id'.
 * If an error occurs during deletion, returns a custom error message; otherwise returns the operation result.
 *
 * PARAMETERS:
 * - groupChallengeId (string): Target group challenge record ID.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing deletion result or error message string.
 */
export async function deleteGroupChallengeById(groupChallengeId: string) {
    const supabase = createClient()
    const { data, error } = await supabase.from('group_challenge').delete().eq('id', groupChallengeId)
    if (error) {
        return { error: 'Failed to delete the group_challenge' }
    }
    return { data, error }
}
