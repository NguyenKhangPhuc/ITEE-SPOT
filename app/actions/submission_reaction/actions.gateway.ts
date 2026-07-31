'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the submission_reaction domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (SubmissionReactionAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getSubmissionReactions } from './get/getSubmissionReactions'
import { createReaction } from './post/createReaction'
import { deleteReaction } from './delete/deleteReaction'

export type SubmissionReactionAction =
    | { type: 'getSubmissionReactions'; payload: { submissionId: string } }
    | { type: 'createReaction'; payload: { submissionId: string; userId: string } }
    | { type: 'deleteReaction'; payload: { submissionId: string; userId: string } }

export async function runSubmissionReactionAction(action: { type: 'getSubmissionReactions'; payload: { submissionId: string } }): ReturnType<typeof getSubmissionReactions>
export async function runSubmissionReactionAction(action: { type: 'createReaction'; payload: { submissionId: string; userId: string } }): ReturnType<typeof createReaction>
export async function runSubmissionReactionAction(action: { type: 'deleteReaction'; payload: { submissionId: string; userId: string } }): ReturnType<typeof deleteReaction>
export async function runSubmissionReactionAction(action: SubmissionReactionAction) {
    switch (action.type) {
        case 'getSubmissionReactions':
            return getSubmissionReactions(action.payload)
        case 'createReaction':
            return createReaction(action.payload)
        case 'deleteReaction':
            return deleteReaction(action.payload)
    }
}
