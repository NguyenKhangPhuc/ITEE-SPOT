'use server'

/**
 * PURPOSE:
 * Registers a new user account with Supabase Auth using email, password, and additional profile metadata.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/authentication.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - formData (SignupForm, Required): Form object containing user registration details (email, password, fullName).
 * - origin (string, Required): The base origin URL used to build the email confirmation callback link.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { SignupForm } from '@/app/types/form_data'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and calls supabase.auth.signUp() with email, password, and options (full_name and emailRedirectTo).
 * On error, it returns the error code string to the caller. On success, it redirects to the account verification page with email query param.
 *
 * PARAMETERS:
 * - formData (SignupForm): User registration payload.
 * - origin (string): Protocol and host origin for redirecting back post-confirmation.
 *
 * RETURN VALUE:
 * - Promise<{ error: string } | never>: Returns error object on failure or redirects on success.
 */
export async function signup(formData: SignupForm, origin: string) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName, email: formData.email }, emailRedirectTo: `${origin}/auth/callback`, }
    })

    if (error) {
        return { error: error.code }
    }

    redirect(`/sign-up/verify-account?email=${formData.email}`)
}
