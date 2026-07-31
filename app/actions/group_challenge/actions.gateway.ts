'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the group_challenge domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (GroupChallengeAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getGroupChallenges } from './get/getGroupChallenges'
import { deleteGroupChallengeById } from './delete/deleteGroupChallengeById'

export type GroupChallengeAction =
    | { type: 'getGroupChallenges'; payload: { groupId: string } }
    | { type: 'deleteGroupChallengeById'; payload: { id: string } }

export async function runGroupChallengeAction(action: { type: 'getGroupChallenges'; payload: { groupId: string } }): ReturnType<typeof getGroupChallenges>
export async function runGroupChallengeAction(action: { type: 'deleteGroupChallengeById'; payload: { id: string } }): ReturnType<typeof deleteGroupChallengeById>
export async function runGroupChallengeAction(action: GroupChallengeAction) {
    switch (action.type) {
        case 'getGroupChallenges':
            return getGroupChallenges(action.payload)
        case 'deleteGroupChallengeById':
            return deleteGroupChallengeById(action.payload.id)
    }
}
