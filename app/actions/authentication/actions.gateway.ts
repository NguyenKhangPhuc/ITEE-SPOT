'use server'

/**
 * PURPOSE:
 * Centralized gateway and dispatcher for all server actions in the authentication domain consumed by Client Components.
 *
 * CONTEXT/PARENT FILE:
 * Created as part of refactor-server-actions steps 5 & 6 to prevent importing multiple server actions directly into Client Components.
 *
 * INPUTS / PARAMETERS:
 * - action (AuthAction, Required): Discriminated union object specifying the action type and required payload parameters.
 */

import { getUser } from './get/getUser'
import { login } from './post/login'
import { signup } from './post/signup'
import { signout } from './post/signout'
import { resendVerificationCode } from './post/resendVerificationCode'

import { LoginForm, SignupForm } from '@/app/types/form_data'

export type AuthAction =
    | { type: 'getUser' }
    | { type: 'login'; payload: LoginForm }
    | { type: 'signup'; payload: { formData: SignupForm; origin: string } }
    | { type: 'signout' }
    | { type: 'resendVerificationCode'; payload: { email: string; origin: string } }

export async function runAuthAction(action: { type: 'getUser' }): ReturnType<typeof getUser>
export async function runAuthAction(action: { type: 'login'; payload: LoginForm }): ReturnType<typeof login>
export async function runAuthAction(action: { type: 'signup'; payload: { formData: SignupForm; origin: string } }): ReturnType<typeof signup>
export async function runAuthAction(action: { type: 'signout' }): ReturnType<typeof signout>
export async function runAuthAction(action: { type: 'resendVerificationCode'; payload: { email: string; origin: string } }): ReturnType<typeof resendVerificationCode>
export async function runAuthAction(action: AuthAction) {
    switch (action.type) {
        case 'getUser':
            return getUser()
        case 'login':
            return login(action.payload)
        case 'signup':
            return signup(action.payload.formData, action.payload.origin)
        case 'signout':
            return signout()
        case 'resendVerificationCode':
            return resendVerificationCode(action.payload.email, action.payload.origin)
    }
}
