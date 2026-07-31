'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the invitations domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (InvitationAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getPendingGroupInvitationsById } from './get/getPendingGroupInvitationsById'
import { getUserInvitations } from './get/getUserInvitations'
import { sendInvitations } from './post/sendInvitations'
import { acceptInvitation } from './put/acceptInvitation'
import { rejectInvitation } from './put/rejectInvitation'

import { InvitationInsert } from '@/app/types/invitation'

export type InvitationAction =
    | { type: 'getPendingGroupInvitationsById'; payload: { groupId: string } }
    | { type: 'getUserInvitations'; payload: { userEmail: string } }
    | { type: 'sendInvitations'; payload: { invitation: InvitationInsert } }
    | { type: 'acceptInvitation'; payload: { invitationId: string; groupId: string; userId: string } }
    | { type: 'rejectInvitation'; payload: { invitationId: string } }

export async function runInvitationAction(action: { type: 'getPendingGroupInvitationsById'; payload: { groupId: string } }): ReturnType<typeof getPendingGroupInvitationsById>
export async function runInvitationAction(action: { type: 'getUserInvitations'; payload: { userEmail: string } }): ReturnType<typeof getUserInvitations>
export async function runInvitationAction(action: { type: 'sendInvitations'; payload: { invitation: InvitationInsert } }): ReturnType<typeof sendInvitations>
export async function runInvitationAction(action: { type: 'acceptInvitation'; payload: { invitationId: string; groupId: string; userId: string } }): ReturnType<typeof acceptInvitation>
export async function runInvitationAction(action: { type: 'rejectInvitation'; payload: { invitationId: string } }): ReturnType<typeof rejectInvitation>
export async function runInvitationAction(action: InvitationAction) {
    switch (action.type) {
        case 'getPendingGroupInvitationsById':
            return getPendingGroupInvitationsById(action.payload.groupId)
        case 'getUserInvitations':
            return getUserInvitations(action.payload.userEmail)
        case 'sendInvitations':
            return sendInvitations(action.payload.invitation)
        case 'acceptInvitation':
            return acceptInvitation(action.payload)
        case 'rejectInvitation':
            return rejectInvitation(action.payload)
    }
}
