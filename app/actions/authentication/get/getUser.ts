'use server'

/**
 * PURPOSE:
 * Fetches the currently authenticated user's session data from Supabase Auth on the server side.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/authentication.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client using cookies and retrieves the authenticated user via supabase.auth.getUser().
 * This provides a secure server-side check of the active user context without exposing tokens to the client.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ data: { user: User | null }, error: AuthError | null }>: An object containing the current user payload or error if unauthenticated.
 */
export async function getUser() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser()
    return { data, error }
}
