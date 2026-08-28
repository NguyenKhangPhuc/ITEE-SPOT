'use client'

/**
 * PURPOSE:
 * Registers a new project group, links selected event challenges, inserts the registering member, and sends invitations to other specified member emails.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/group_member.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - registerGroupMemberData (RegisterGroupMember, Required): Object payload containing group title, description, event_id, user_id, member_emails, and challenges array.
 */

import { createClient } from '@/app/utils/supabase/client'
import { RegisterGroupMember } from '@/app/types/group_member'
import { InvitationInsert } from '@/app/types/invitation'
import { INVITATION_STATUS } from '@/app/types/enum'
import { GroupChallengeRelationInsert } from '@/app/types/group_challenge'

/**
 * BEHAVIORAL MECHANISM:
 * Validates member emails against registered user profiles, creates the group row in 'groups', links group challenges in 'group_challenge',
 * adds the group creator into 'group_members', and creates pending invitations in 'invitation'. On member insert failure, rolls back group creation.
 *
 * PARAMETERS:
 * - registerGroupMemberData (RegisterGroupMember): Registration form data payload.
 *
 * RETURN VALUE:
 * - Promise<{ createdGroup?: any, error?: string | any }>: Object containing created group payload or error message string.
 */
export async function insertGroupMembers(registerGroupMemberData: RegisterGroupMember) {
    const supabase = createClient();

    const filteredOutEmails = registerGroupMemberData.member_emails.filter((value) => value != null).splice(1)
    const { data, error } = await supabase.from('profiles').select('email').in('email', filteredOutEmails);
    if ((data?.length == 0 && filteredOutEmails.length != 0) || error) {
        return { error: "Incorrect member email" }
    }

    const { data: createdGroup, error: groupError } = await supabase.from('groups').insert([{
        group_name: registerGroupMemberData.title,
        short_description: registerGroupMemberData.short_description,
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
        return { group_id: createdGroup.id, member_email: value.toLowerCase().trim(), invitation_status: INVITATION_STATUS.PENDING }
    })

    const { data: createdInvitation, error: invitationError } = await supabase.from('invitation').insert(invitations)

    if (invitationError) {
        return { error: 'Fail to send the invitation to other members' }
    }
    return { createdGroup, error: groupError }
}
