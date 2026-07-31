'use server'

/**
 * PURPOSE:
 * Rejects a pending group invitation, updating its status to REJECTED in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/invitations.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing invitationId.
 *   - invitationId (string, Required): Target invitation ID string to reject.
 */

import { createClient } from '@/app/utils/supabase/server'
import { INVITATION_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and updates column 'invitation_status' to REJECTED in table 'invitation' for matching invitationId.
 *
 * PARAMETERS:
 * - { invitationId }: Parameter object containing invitationId string.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing update response or error message string.
 */
export async function rejectInvitation({ invitationId }: { invitationId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('invitation').update({ invitation_status: INVITATION_STATUS.REJECTED }).eq('id', invitationId)

    if (error) {
        return { error: 'Failed to reject the invitation' }
    }

    return { data, error }
}
