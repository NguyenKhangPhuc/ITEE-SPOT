'use client'

/**
 * PURPOSE:
 * Updates the administrative/user role of a profile record matching a given user ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/profiles.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - userId (string, Required): Target user profile ID string.
 * - role (PROFILE_ROLE, Required): Target role enum value to set on the profile.
 */

import { createClient } from '@/app/utils/supabase/client'
import { PROFILE_ROLE } from '@/app/types/enum'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and updates column 'role' in table 'profiles' for matching userId.
 * Returns operation result data or error message string.
 *
 * PARAMETERS:
 * - userId (string): Target user ID.
 * - role (PROFILE_ROLE): New profile role enum.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing database response payload or error message.
 */
export async function updateUserRoleByUserId(userId: string, role: PROFILE_ROLE) {
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').update({ role: role }).eq('id', userId)
    if (error) {
        return { error: 'Fail to update user profile' }
    }
    return { data, error }
}
