'use server'
import { INVITATION_STATUS } from "../types/enum";
import { InvitationInsert } from "../types/invitation";
import { SubmissionInsert } from "../types/submission";
import { createClient } from "../utils/supabase/server";

export async function sendInvitations(invitation: InvitationInsert) {
    const supabase = await createClient();
    console.log(invitation)
    const { data: foundMember, error: foundMemberError } = await supabase.from('group_members')
        .select('*, profiles!inner(email)')
        .eq('group_id', invitation.group_id!).eq('profiles.email', invitation.member_email ?? "").maybeSingle()

    if (foundMemberError) {
        throw new Error(foundMemberError.message)
    }
    console.log(foundMember)
    if (foundMember) {
        throw new Error('Member is already in a team')
    }

    const { data, error } = await supabase.from('invitation').upsert(invitation, { onConflict: 'group_id,member_email' })

    if (error) {
        throw new Error(error.message)
    }
    return data
}

export async function getUserInvitations(userEmail: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('invitation').select('*, groups (short_description, group_name, event_id, events (*))').eq('member_email', userEmail)

    return { data, error }
}


export async function acceptInvitation({ invitationId, groupId, userId }: { invitationId: string, groupId: string, userId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('invitation').update({ invitation_status: INVITATION_STATUS.ACCEPTED }).eq('id', invitationId)

    if (error) {
        throw new Error(error.message)
    }

    const { data: createdMember, error: memberError } = await supabase.from('group_members').insert({
        group_id: groupId,
        member_id: userId
    })

    if (memberError) {
        throw new Error(memberError.message)
    }

    return data
}

export async function rejectInvitation({ invitationId }: { invitationId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('invitation').update({ invitation_status: INVITATION_STATUS.REJECTED }).eq('id', invitationId)

    if (error) {
        throw new Error(error.message)
    }

    return data
}