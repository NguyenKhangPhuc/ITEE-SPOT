'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the groups domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (GroupAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getAllGroups } from './get/getAllGroups'
import { getEventGroups } from './get/getEventGroups'
import { getSingleGroup } from './get/getSingleGroup'
import { getUserGroups } from './get/getUserGroups'
import { updateGroupNameAndDescription } from './put/updateGroupNameAndDescription'
import { updateGroupPosterPath } from './put/updateGroupPosterPath'

export type GroupAction =
    | { type: 'getAllGroups' }
    | { type: 'getEventGroups'; payload: { eventId: string } }
    | { type: 'getSingleGroup'; payload: { groupId: string } }
    | { type: 'getUserGroups' }
    | { type: 'updateGroupNameAndDescription'; payload: { groupId: string; groupName: string; description: string } }
    | { type: 'updateGroupPosterPath'; payload: { groupId: string; avatarFile: File | null; originalPath: string | null } }

export async function runGroupAction(action: { type: 'getAllGroups' }): ReturnType<typeof getAllGroups>
export async function runGroupAction(action: { type: 'getEventGroups'; payload: { eventId: string } }): ReturnType<typeof getEventGroups>
export async function runGroupAction(action: { type: 'getSingleGroup'; payload: { groupId: string } }): ReturnType<typeof getSingleGroup>
export async function runGroupAction(action: { type: 'getUserGroups' }): ReturnType<typeof getUserGroups>
export async function runGroupAction(action: { type: 'updateGroupNameAndDescription'; payload: { groupId: string; groupName: string; description: string } }): ReturnType<typeof updateGroupNameAndDescription>
export async function runGroupAction(action: { type: 'updateGroupPosterPath'; payload: { groupId: string; avatarFile: File | null; originalPath: string | null } }): ReturnType<typeof updateGroupPosterPath>
export async function runGroupAction(action: GroupAction) {
    switch (action.type) {
        case 'getAllGroups':
            return getAllGroups()
        case 'getEventGroups':
            return getEventGroups(action.payload.eventId)
        case 'getSingleGroup':
            return getSingleGroup(action.payload)
        case 'getUserGroups':
            return getUserGroups()
        case 'updateGroupNameAndDescription':
            return updateGroupNameAndDescription(action.payload)
        case 'updateGroupPosterPath':
            return updateGroupPosterPath(action.payload)
    }
}
