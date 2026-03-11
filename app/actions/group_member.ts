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
    console.log(filteredOutEmails, registerGroupMemberData.member_emails)
    const { data, error } = await supabase.from('profiles').select('email').in('email', filteredOutEmails);
    console.log(data)
    if (data?.length == 0 && filteredOutEmails.length != 0) {
        console.log(error)
        throw new Error(`Incorrect member email`)
    }

    if (filteredOutEmails.length != 0) {
        const { data: foundMembers, error: foundError } = await supabase
            .from('group_members')
            .select(`
    profiles (email),
    groups!inner (event_id)
  `)
            .eq('groups.event_id', registerGroupMemberData.event_id)
            .in('profiles.email', filteredOutEmails);

        if (foundMembers && foundMembers.length > 0) {
            const existingEmails = foundMembers.map(m => m.profiles?.email);
            throw new Error(`User already register for the event: ${existingEmails.join(', ')}`);
        }
    }

    const { data: createdGroup, error: groupError } = await supabase.from('groups').insert([{
        group_name: registerGroupMemberData.title,
        event_id: registerGroupMemberData.event_id,
    }]).select().single()

    if (groupError) {
        throw new Error('Fail to create the group, try again!')
    }

    const groupChallengeRelation: Array<GroupChallengeRelationInsert> = registerGroupMemberData.challenges.map((challengeId) => {
        return { group_id: createdGroup.id, challenge_id: challengeId, event_id: registerGroupMemberData.event_id }
    })

    const { data: createdChallengeRelation, error: challengeRelationError } = await supabase.from('group_challenge').insert(groupChallengeRelation)

    if (challengeRelationError) {
        throw new Error(challengeRelationError.message)
    }

    const { data: createdMember, error: memberError } = await supabase.from('group_members').insert([{
        group_id: createdGroup.id,
        member_id: registerGroupMemberData.user_id
    }])

    if (memberError) {
        await supabase.from('groups').delete().eq('id', createdGroup.id);
        throw new Error(memberError.message)
    }

    if (filteredOutEmails.length == 0) {
        return { createdGroup, groupError }
    }

    const invitations: Array<InvitationInsert> = filteredOutEmails.map((value) => {
        return { group_id: createdGroup.id, member_email: value, invitation_status: INVITATION_STATUS.PENDING }
    })

    const { data: createdInvitation, error: invitationError } = await supabase.from('invitation').insert(invitations)

    if (invitationError) {
        throw new Error(invitationError.message)
    }
    return { createdGroup, groupError }
}