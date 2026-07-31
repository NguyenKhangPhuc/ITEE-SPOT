'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the submissions domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (SubmissionAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getGoupChallengeSubmission } from './get/getGoupChallengeSubmission'
import { getSubmissionByGroupId } from './get/getSubmissionByGroupId'
import { getSubmissionById } from './get/getSubmissionById'
import { getSubmissionGradeBasedOnStar } from './get/getSubmissionGradeBasedOnStar'
import { getSubmissionWithGrade } from './get/getSubmissionWithGrade'
import { getTop5SubmissionGrade } from './get/getTop5SubmissionGrade'
import { saveGroupChallengeSubmission } from './post/saveGroupChallengeSubmission'

import { SubmissionInsert } from '@/app/types/submission'
import { SubmissionFileExtended } from '@/app/types/submission_files'
import { FunFactsInsert } from '@/app/types/funfacts'

export type SubmissionAction =
    | { type: 'getGoupChallengeSubmission'; payload: { groupId: string; groupChallengeId: string } }
    | { type: 'getSubmissionByGroupId'; payload: { groupId: string } }
    | { type: 'getSubmissionById'; payload: { submissionId: string } }
    | { type: 'getSubmissionGradeBasedOnStar'; payload: { eventId: string; rating: number; userId: string } }
    | { type: 'getSubmissionWithGrade'; payload: { eventId: string; userId: string } }
    | { type: 'getTop5SubmissionGrade'; payload: { eventId: string; userId: string } }
    | { type: 'saveGroupChallengeSubmission'; payload: { submission: SubmissionInsert; submittedFiles: Array<SubmissionFileExtended>; funfacts: Array<FunFactsInsert> } }

export async function runSubmissionAction(action: { type: 'getGoupChallengeSubmission'; payload: { groupId: string; groupChallengeId: string } }): ReturnType<typeof getGoupChallengeSubmission>
export async function runSubmissionAction(action: { type: 'getSubmissionByGroupId'; payload: { groupId: string } }): ReturnType<typeof getSubmissionByGroupId>
export async function runSubmissionAction(action: { type: 'getSubmissionById'; payload: { submissionId: string } }): ReturnType<typeof getSubmissionById>
export async function runSubmissionAction(action: { type: 'getSubmissionGradeBasedOnStar'; payload: { eventId: string; rating: number; userId: string } }): ReturnType<typeof getSubmissionGradeBasedOnStar>
export async function runSubmissionAction(action: { type: 'getSubmissionWithGrade'; payload: { eventId: string; userId: string } }): ReturnType<typeof getSubmissionWithGrade>
export async function runSubmissionAction(action: { type: 'getTop5SubmissionGrade'; payload: { eventId: string; userId: string } }): ReturnType<typeof getTop5SubmissionGrade>
export async function runSubmissionAction(action: { type: 'saveGroupChallengeSubmission'; payload: { submission: SubmissionInsert; submittedFiles: Array<SubmissionFileExtended>; funfacts: Array<FunFactsInsert> } }): ReturnType<typeof saveGroupChallengeSubmission>
export async function runSubmissionAction(action: SubmissionAction) {
    switch (action.type) {
        case 'getGoupChallengeSubmission':
            return getGoupChallengeSubmission(action.payload)
        case 'getSubmissionByGroupId':
            return getSubmissionByGroupId(action.payload)
        case 'getSubmissionById':
            return getSubmissionById(action.payload.submissionId)
        case 'getSubmissionGradeBasedOnStar':
            return getSubmissionGradeBasedOnStar(action.payload)
        case 'getSubmissionWithGrade':
            return getSubmissionWithGrade(action.payload)
        case 'getTop5SubmissionGrade':
            return getTop5SubmissionGrade(action.payload)
        case 'saveGroupChallengeSubmission':
            return saveGroupChallengeSubmission(action.payload)
    }
}
