'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the submission_comment domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (SubmissionCommentAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getSubmissionComments } from './get/getSubmissionComments'
import { createSubmissionComment } from './post/createSubmissionComment'

import { SubmissionCommentInsert } from '@/app/types/submission_comments'

export type SubmissionCommentAction =
    | { type: 'getSubmissionComments'; payload: { submissionId: string; page: number } }
    | { type: 'createSubmissionComment'; payload: { submissionComment: SubmissionCommentInsert } }

export async function runSubmissionCommentAction(action: { type: 'getSubmissionComments'; payload: { submissionId: string; page: number } }): ReturnType<typeof getSubmissionComments>
export async function runSubmissionCommentAction(action: { type: 'createSubmissionComment'; payload: { submissionComment: SubmissionCommentInsert } }): ReturnType<typeof createSubmissionComment>
export async function runSubmissionCommentAction(action: SubmissionCommentAction) {
    switch (action.type) {
        case 'getSubmissionComments':
            return getSubmissionComments(action.payload)
        case 'createSubmissionComment':
            return createSubmissionComment(action.payload.submissionComment)
    }
}
