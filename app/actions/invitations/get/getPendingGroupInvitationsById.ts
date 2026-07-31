'use server'

/**
 * PURPOSE:
 * Fetches all pending invitation records for a specific group ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/invitations.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - groupId (string, Required): Unique identifier of target group.
 */

import { createClient } from '@/app/utils/supabase/server'
import { INVITATION_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'invitation' filtering by group_id and invitation_status = PENDING.
 * Returns pending invitation records array or error message on failure.
 *
 * PARAMETERS:
 * - groupId (string): Target group ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing pending invitations or error message string.
 */
export const getPendingGroupInvitationsById = async (groupId: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('invitation').select('*').eq('group_id', groupId).eq('invitation_status', INVITATION_STATUS.PENDING)
    if (error) {
        return { error: 'Failed to find the pending invitations' }
    }
    return { data, error }
}
