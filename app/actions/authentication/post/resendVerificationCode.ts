'use server'

/**
 * PURPOSE:
 * Resends the email signup verification email / confirmation code to the user.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/authentication.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - email (string, Required): Target user email address for resending verification code.
 * - origin (string, Required): The base origin URL used to construct the email callback link.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and calls supabase.auth.resend() for type 'signup' with specified email and redirect options.
 * Returns the payload along with any error code returned by Supabase.
 *
 * PARAMETERS:
 * - email (string): Destination email address.
 * - origin (string): Protocol and host origin for email redirect link.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error?: string }>: Object containing Supabase response data and optional error code.
 */
export async function resendVerificationCode(email: string, origin: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
            emailRedirectTo: `${origin}/auth/callback`
        }
    })

    if (error) {
        return { data, error: error.code }
    }

    return { data }
}
