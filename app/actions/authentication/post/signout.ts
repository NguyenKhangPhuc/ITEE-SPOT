'use server'

/**
 * PURPOSE:
 * Signs out the currently authenticated user by revoking their session cookies in Supabase Auth.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/authentication.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes the server-side Supabase client and triggers supabase.auth.signOut().
 * If signout fails, it returns the error code; otherwise, it redirects the user to the '/login' portal.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ error: string } | never>: Returns error object on failure or redirects to login page on success.
 */
export async function signout() {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.code }
    }
    redirect('/login')
}
