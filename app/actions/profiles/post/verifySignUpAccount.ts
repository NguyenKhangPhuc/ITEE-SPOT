'use server'

/**
 * PURPOSE:
 * Verifies the email signup OTP confirmation token using Supabase Auth.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/profiles.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - verifyAccount (VerifyAccountForm, Required): Object containing user email and OTP verification code.
 */

import { createClient } from '@/app/utils/supabase/server'
import { VerifyAccountForm } from '@/app/types/form_data'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and calls supabase.auth.verifyOtp() for type 'signup' with the email and token.
 * Returns verified session payload or error message string if OTP verification fails.
 *
 * PARAMETERS:
 * - verifyAccount (VerifyAccountForm): Form data payload holding email and OTP token.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing session data or error message string.
 */
export async function verifySignUpAccount(verifyAccount: VerifyAccountForm) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp(
        {
            email: verifyAccount.email,
            token: verifyAccount.otp,
            type: 'signup'
        }
    )
    if (error) {
        return { error: 'Fail to verify the OTP' }
    }
    if (data.session == null) {
        return { error: 'Fail to verify the OTP' }
    }
    return { data, error }
}
