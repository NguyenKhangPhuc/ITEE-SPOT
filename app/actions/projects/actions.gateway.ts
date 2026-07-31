'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the projects domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (ProjectAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getAllProjects } from './get/getAllProjects'
import { getAllProjectsBasedOnStatus } from './get/getAllProjectsBasedOnStatus'
import { getSingleProject } from './get/getSingleProject'
import { getSingleProjectByGroupAndChallenge } from './get/getSingleProjectByGroupAndChallenge'
import { getUserSubmittedProjects } from './get/getUserSubmittedProjects'
import { saveStudentGroupProject } from './post/saveStudentGroupProject'
import { updateProjectStatus } from './put/updateProjectStatus'

import { PROJECT_STATUS } from '@/app/types/enum'
import { ProjectsInsert } from '@/app/types/projects'
import { SubmissionFileExtended } from '@/app/types/submission_files'
import { ProjectAwardsInsert } from '@/app/types/project_awards'

export type ProjectAction =
    | { type: 'getAllProjects' }
    | { type: 'getAllProjectsBasedOnStatus'; payload: { status: PROJECT_STATUS | null; ascending: boolean } }
    | { type: 'getSingleProject'; payload: { projectId: string } }
    | { type: 'getSingleProjectByGroupAndChallenge'; payload: { group_id: string; group_challenge_id: string } }
    | { type: 'getUserSubmittedProjects'; payload: { userId: string; status: PROJECT_STATUS | null; ascending: boolean } }
    | { type: 'saveStudentGroupProject'; payload: { project: ProjectsInsert; submittedFiles: Array<SubmissionFileExtended>; projectAwards: Array<ProjectAwardsInsert> } }
    | { type: 'updateProjectStatus'; payload: { projectId: string; status: PROJECT_STATUS } }

export async function runProjectAction(action: { type: 'getAllProjects' }): ReturnType<typeof getAllProjects>
export async function runProjectAction(action: { type: 'getAllProjectsBasedOnStatus'; payload: { status: PROJECT_STATUS | null; ascending: boolean } }): ReturnType<typeof getAllProjectsBasedOnStatus>
export async function runProjectAction(action: { type: 'getSingleProject'; payload: { projectId: string } }): ReturnType<typeof getSingleProject>
export async function runProjectAction(action: { type: 'getSingleProjectByGroupAndChallenge'; payload: { group_id: string; group_challenge_id: string } }): ReturnType<typeof getSingleProjectByGroupAndChallenge>
export async function runProjectAction(action: { type: 'getUserSubmittedProjects'; payload: { userId: string; status: PROJECT_STATUS | null; ascending: boolean } }): ReturnType<typeof getUserSubmittedProjects>
export async function runProjectAction(action: { type: 'saveStudentGroupProject'; payload: { project: ProjectsInsert; submittedFiles: Array<SubmissionFileExtended>; projectAwards: Array<ProjectAwardsInsert> } }): ReturnType<typeof saveStudentGroupProject>
export async function runProjectAction(action: { type: 'updateProjectStatus'; payload: { projectId: string; status: PROJECT_STATUS } }): ReturnType<typeof updateProjectStatus>
export async function runProjectAction(action: ProjectAction) {
    switch (action.type) {
        case 'getAllProjects':
            return getAllProjects()
        case 'getAllProjectsBasedOnStatus':
            return getAllProjectsBasedOnStatus(action.payload)
        case 'getSingleProject':
            return getSingleProject(action.payload)
        case 'getSingleProjectByGroupAndChallenge':
            return getSingleProjectByGroupAndChallenge(action.payload)
        case 'getUserSubmittedProjects':
            return getUserSubmittedProjects(action.payload)
        case 'saveStudentGroupProject':
            return saveStudentGroupProject(action.payload)
        case 'updateProjectStatus':
            return updateProjectStatus(action.payload)
    }
}
