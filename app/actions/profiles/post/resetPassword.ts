'use server'

/**
 * PURPOSE:
 * Verifies email OTP token, updates the user's password in Supabase Auth, and performs a global signout.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/profiles.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - resetPasswordData (ResetPasswordForm, Required): Object payload containing email, otp, and newPassword.
 */

import { createClient } from '@/app/utils/supabase/server'
import { ResetPasswordForm } from '@/app/types/form_data'

/**
 * BEHAVIORAL MECHANISM:
 * Calls supabase.auth.verifyOtp() for type 'email'. On successful session verification, updates user password
 * via supabase.auth.updateUser(), then invalidates all active sessions via supabase.auth.signOut({ scope: 'global' }).
 *
 * PARAMETERS:
 * - resetPasswordData (ResetPasswordForm): Form data holding email, OTP token, and new password.
 *
 * RETURN VALUE:
 * - Promise<{ error: string | null }>: Object containing error message on failure or null on success.
 */
export async function resetPassword(resetPasswordData: ResetPasswordForm) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp(
        {
            email: resetPasswordData.email,
            token: resetPasswordData.otp,
            type: 'email'
        }
    )
    if (error) {
        return { error: 'Fail to verify the OTP' }
    }

    if (data.session == null) {
        return { error: 'Fail to update the user password' }
    }
    const { error: userError } = await supabase.auth.updateUser({ password: resetPasswordData.newPassword })
    if (userError) {
        return { error: 'Fail to update the user password' }
    }
    await supabase.auth.signOut({ scope: 'global' });

    return { error: null }
}
