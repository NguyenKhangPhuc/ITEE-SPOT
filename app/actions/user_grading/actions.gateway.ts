'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the user_grading domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (UserGradingAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getUserGradingForSubmissionById } from './get/getUserGradingForSubmissionById'
import { updateUserGrading } from './put/updateUserGrading'

import { UserSubmissionGradeInsert } from '@/app/types/user_submission_grade'

export type UserGradingAction =
    | { type: 'getUserGradingForSubmissionById'; payload: { userId: string; submissionId: string } }
    | { type: 'updateUserGrading'; payload: { grades: Array<UserSubmissionGradeInsert>; submissionId: string } }

export async function runUserGradingAction(action: { type: 'getUserGradingForSubmissionById'; payload: { userId: string; submissionId: string } }): ReturnType<typeof getUserGradingForSubmissionById>
export async function runUserGradingAction(action: { type: 'updateUserGrading'; payload: { grades: Array<UserSubmissionGradeInsert>; submissionId: string } }): ReturnType<typeof updateUserGrading>
export async function runUserGradingAction(action: UserGradingAction) {
    switch (action.type) {
        case 'getUserGradingForSubmissionById':
            return getUserGradingForSubmissionById(action.payload)
        case 'updateUserGrading':
            return updateUserGrading(action.payload)
    }
}
