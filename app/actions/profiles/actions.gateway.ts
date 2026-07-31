'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the profiles domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (ProfileAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getAllUsers } from './get/getAllUsers'
import { getUserProfile } from './get/getUserProfile'
import { resetPassword } from './post/resetPassword'
import { verifySignUpAccount } from './post/verifySignUpAccount'
import { updateProfile } from './put/updateProfile'
import { updateProfileAvatar } from './put/updateProfileAvatar'
import { updateUserRoleByUserId } from './put/updateUserRoleByUserId'

import { ProfileInsert } from '@/app/types/profile'
import { PROFILE_ROLE } from '@/app/types/enum'
import { ResetPasswordForm, VerifyAccountForm } from '@/app/types/form_data'

export type ProfileAction =
    | { type: 'getAllUsers' }
    | { type: 'getUserProfile'; payload: { userId: string } }
    | { type: 'resetPassword'; payload: ResetPasswordForm }
    | { type: 'verifySignUpAccount'; payload: VerifyAccountForm }
    | { type: 'updateProfile'; payload: { profile: ProfileInsert } }
    | { type: 'updateProfileAvatar'; payload: { userId: string; posterFile: File | null; originalPath: string | null } }
    | { type: 'updateUserRoleByUserId'; payload: { userId: string; role: PROFILE_ROLE } }

export async function runProfileAction(action: { type: 'getAllUsers' }): ReturnType<typeof getAllUsers>
export async function runProfileAction(action: { type: 'getUserProfile'; payload: { userId: string } }): ReturnType<typeof getUserProfile>
export async function runProfileAction(action: { type: 'resetPassword'; payload: ResetPasswordForm }): ReturnType<typeof resetPassword>
export async function runProfileAction(action: { type: 'verifySignUpAccount'; payload: VerifyAccountForm }): ReturnType<typeof verifySignUpAccount>
export async function runProfileAction(action: { type: 'updateProfile'; payload: { profile: ProfileInsert } }): ReturnType<typeof updateProfile>
export async function runProfileAction(action: { type: 'updateProfileAvatar'; payload: { userId: string; posterFile: File | null; originalPath: string | null } }): ReturnType<typeof updateProfileAvatar>
export async function runProfileAction(action: { type: 'updateUserRoleByUserId'; payload: { userId: string; role: PROFILE_ROLE } }): ReturnType<typeof updateUserRoleByUserId>
export async function runProfileAction(action: ProfileAction) {
    switch (action.type) {
        case 'getAllUsers':
            return getAllUsers()
        case 'getUserProfile':
            return getUserProfile(action.payload.userId)
        case 'resetPassword':
            return resetPassword(action.payload)
        case 'verifySignUpAccount':
            return verifySignUpAccount(action.payload)
        case 'updateProfile':
            return updateProfile(action.payload)
        case 'updateProfileAvatar':
            return updateProfileAvatar(action.payload)
        case 'updateUserRoleByUserId':
            return updateUserRoleByUserId(action.payload.userId, action.payload.role)
    }
}
