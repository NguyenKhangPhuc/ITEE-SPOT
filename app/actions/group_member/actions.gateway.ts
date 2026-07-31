'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the group_member domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (GroupMemberAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { insertGroupMembers } from './post/insertGroupMembers'
import { deleteGroupMemberById } from './delete/deleteGroupMemberById'
import { removeStudentsThemselveFromGroupById } from './delete/removeStudentsThemselveFromGroupById'

import { RegisterGroupMember } from '@/app/types/group_member'

export type GroupMemberAction =
    | { type: 'insertGroupMembers'; payload: { registerGroupMemberData: RegisterGroupMember } }
    | { type: 'deleteGroupMemberById'; payload: { memberId: string } }
    | { type: 'removeStudentsThemselveFromGroupById'; payload: { groupId: string } }

export async function runGroupMemberAction(action: { type: 'insertGroupMembers'; payload: { registerGroupMemberData: RegisterGroupMember } }): ReturnType<typeof insertGroupMembers>
export async function runGroupMemberAction(action: { type: 'deleteGroupMemberById'; payload: { memberId: string } }): ReturnType<typeof deleteGroupMemberById>
export async function runGroupMemberAction(action: { type: 'removeStudentsThemselveFromGroupById'; payload: { groupId: string } }): ReturnType<typeof removeStudentsThemselveFromGroupById>
export async function runGroupMemberAction(action: GroupMemberAction) {
    switch (action.type) {
        case 'insertGroupMembers':
            return insertGroupMembers(action.payload.registerGroupMemberData)
        case 'deleteGroupMemberById':
            return deleteGroupMemberById(action.payload.memberId)
        case 'removeStudentsThemselveFromGroupById':
            return removeStudentsThemselveFromGroupById(action.payload.groupId)
    }
}
