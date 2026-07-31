'use server'

/**
 * PURPOSE:
 * Handles user authentication via email and password credentials using Supabase Auth.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/authentication.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - formData (LoginForm, Required): Form object containing user email and password credentials.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'
import { LoginForm } from '@/app/types/form_data'

/**
 * BEHAVIORAL MECHANISM:
 * Creates a server-side Supabase client, extracts email and password from input data, and invokes
 * supabase.auth.signInWithPassword(). If authentication fails, it returns the error code for UI display;
 * otherwise, it executes a Next.js server-side redirect to the root page ('/').
 *
 * PARAMETERS:
 * - formData (LoginForm): Object holding user email and password input strings.
 *
 * RETURN VALUE:
 * - Promise<{ error: string } | never>: Returns an error object with error code on failure, or redirects on success.
 */
export async function login(formData: LoginForm) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.email,
        password: formData.password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.code }
    }

    redirect('/')
}
