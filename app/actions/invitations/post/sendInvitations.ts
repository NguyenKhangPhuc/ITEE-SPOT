'use server'

/**
 * PURPOSE:
 * Sends an invitation to a target member email to join a project group.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/invitations.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - invitation (InvitationInsert, Required): Object payload containing group_id and member_email.
 */

import { createClient } from '@/app/utils/supabase/server'
import { InvitationInsert } from '@/app/types/invitation'

/**
 * BEHAVIORAL MECHANISM:
 * Checks whether the member is already present in 'group_members'. If already a member, returns error.
 * Otherwise, upserts an invitation row into table 'invitation' matching group_id and member_email.
 *
 * PARAMETERS:
 * - invitation (InvitationInsert): Invitation payload object.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing invitation payload or error message string.
 */
export async function sendInvitations(invitation: InvitationInsert) {
    const supabase = await createClient();
    const { data: foundMember, error: foundMemberError } = await supabase.from('group_members')
        .select('*, profiles!inner(email)')
        .eq('group_id', invitation.group_id!).eq('profiles.email', invitation.member_email ?? "").maybeSingle()

    if (foundMemberError) {
        return { error: "Fail to check the user information" }
    }
    if (foundMember) {
        return { error: "Member is already in the team" }
    }

    const { data, error } = await supabase.from('invitation').upsert(invitation, { onConflict: 'group_id,member_email' })

    if (error) {
        return { error: "Fail to create the invitation to the other member" }
    }
    return { data, error }
}
