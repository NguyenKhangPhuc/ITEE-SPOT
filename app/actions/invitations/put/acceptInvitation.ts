'use client'

/**
 * PURPOSE:
 * Accepts a pending invitation, updating its status to ACCEPTED and adding the user to group_members.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/invitations.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing invitationId, groupId, and userId.
 *   - invitationId (string, Required): Target invitation ID string.
 *   - groupId (string, Required): Target group ID string to join.
 *   - userId (string, Required): Accepting user ID string.
 */

import { createClient } from '@/app/utils/supabase/client'
import { INVITATION_STATUS } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Updates the invitation status column to ACCEPTED in table 'invitation' for the matching invitationId,
 * then inserts a new row into table 'group_members' with groupId and userId.
 *
 * PARAMETERS:
 * - { invitationId, groupId, userId }: Parameter object holding invitation, group, and user IDs.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing update payload or error message.
 */
export async function acceptInvitation({ invitationId, groupId, userId }: { invitationId: string, groupId: string, userId: string }) {
    const supabase = createClient();

    const { data, error } = await supabase.from('invitation').update({ invitation_status: INVITATION_STATUS.ACCEPTED }).eq('id', invitationId)

    if (error) {
        return { error: "Fail to accept the invitation" }
    }

    const { data: createdMember, error: memberError } = await supabase.from('group_members').insert({
        group_id: groupId,
        member_id: userId
    })

    if (memberError) {
        return { error: "Failed to become a member, please contact staff" }
    }

    return { data, error }
}
