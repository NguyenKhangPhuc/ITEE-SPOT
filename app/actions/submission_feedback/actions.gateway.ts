'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the submission_feedback domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (SubmissionFeedbackAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getSubmissionFeedBackBySubmissionId } from './get/getSubmissionFeedBackBySubmissionId'
import { getSubmissionFeedBackByUserIdAndSubmissionId } from './get/getSubmissionFeedBackByUserIdAndSubmissionId'
import { updateSubmissionFeedback } from './put/updateSubmissionFeedback'

import { SubmissionFeedbackInsert } from '@/app/types/submission_feedback'

export type SubmissionFeedbackAction =
    | { type: 'getSubmissionFeedBackBySubmissionId'; payload: { submissionId: string } }
    | { type: 'getSubmissionFeedBackByUserIdAndSubmissionId'; payload: { userId: string; submissionId: string } }
    | { type: 'updateSubmissionFeedback'; payload: { submissionFeedback: SubmissionFeedbackInsert } }

export async function runSubmissionFeedbackAction(action: { type: 'getSubmissionFeedBackBySubmissionId'; payload: { submissionId: string } }): ReturnType<typeof getSubmissionFeedBackBySubmissionId>
export async function runSubmissionFeedbackAction(action: { type: 'getSubmissionFeedBackByUserIdAndSubmissionId'; payload: { userId: string; submissionId: string } }): ReturnType<typeof getSubmissionFeedBackByUserIdAndSubmissionId>
export async function runSubmissionFeedbackAction(action: { type: 'updateSubmissionFeedback'; payload: { submissionFeedback: SubmissionFeedbackInsert } }): ReturnType<typeof updateSubmissionFeedback>
export async function runSubmissionFeedbackAction(action: SubmissionFeedbackAction) {
    switch (action.type) {
        case 'getSubmissionFeedBackBySubmissionId':
            return getSubmissionFeedBackBySubmissionId(action.payload)
        case 'getSubmissionFeedBackByUserIdAndSubmissionId':
            return getSubmissionFeedBackByUserIdAndSubmissionId(action.payload)
        case 'updateSubmissionFeedback':
            return updateSubmissionFeedback(action.payload)
    }
}
