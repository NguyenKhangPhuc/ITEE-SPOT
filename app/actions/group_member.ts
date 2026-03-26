'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { RegisterGroupMember } from '../types/group_member';
import { InvitationInsert } from '../types/invitation';
import { INVITATION_STATUS } from '../types/enum';
import { GroupChallengeRelation, GroupChallengeRelationInsert } from '../types/group_challenge';



export async function insertGroupMembers(registerGroupMemberData: RegisterGroupMember) {
    const supabase = await createClient();

    const filteredOutEmails = registerGroupMemberData.member_emails.filter((value) => value != null).splice(1)
    const { data, error } = await supabase.from('profiles').select('email').in('email', filteredOutEmails);
    if (data?.length == 0 && filteredOutEmails.length != 0) {
        return { error: "Incorrect member email" }
    }
    // Uncomment if you want user can only register one group / event
    //     if (filteredOutEmails.length != 0) {
    //         const { data: foundMembers, error: foundError } = await supabase
    //             .from('group_members')
    //             .select(`
    //     profiles (email),
    //     groups!inner (event_id)
    //   `)
    //             .eq('groups.event_id', registerGroupMemberData.event_id)
    //             .in('profiles.email', filteredOutEmails);

    //         if (foundMembers && foundMembers.length > 0) {
    //             const existingEmails = foundMembers.map(m => m.profiles?.email);
    //             throw new Error(`User already register for the event: ${existingEmails.join(', ')}`);
    //         }
    //     }

    const { data: createdGroup, error: groupError } = await supabase.from('groups').insert([{
        group_name: registerGroupMemberData.title,
        event_id: registerGroupMemberData.event_id,
    }]).select().single()

    if (groupError) {
        return { error: 'Failed to create the event, please try again later' }
    }

    const groupChallengeRelation: Array<GroupChallengeRelationInsert> = registerGroupMemberData.challenges.map((challengeId) => {
        return { group_id: createdGroup.id, challenge_id: challengeId, event_id: registerGroupMemberData.event_id }
    })

    const { data: createdChallengeRelation, error: challengeRelationError } = await supabase.from('group_challenge').insert(groupChallengeRelation)

    if (challengeRelationError) {
        return { error: 'Failed to choose the challenges for the group, please contact the staff' }
    }

    const { data: createdMember, error: memberError } = await supabase.from('group_members').insert([{
        group_id: createdGroup.id,
        member_id: registerGroupMemberData.user_id
    }])

    if (memberError) {
        await supabase.from('groups').delete().eq('id', createdGroup.id);
        return { error: 'Fail to insert the member to the group, please contact the staff' }
    }

    if (filteredOutEmails.length == 0) {
        return { createdGroup, error: groupError }
    }

    const invitations: Array<InvitationInsert> = filteredOutEmails.map((value) => {
        return { group_id: createdGroup.id, member_email: value, invitation_status: INVITATION_STATUS.PENDING }
    })

    const { data: createdInvitation, error: invitationError } = await supabase.from('invitation').insert(invitations)

    if (invitationError) {
        return { error: 'Fail to send the invitation to other members' }
    }
    return { createdGroup, error: groupError }
}