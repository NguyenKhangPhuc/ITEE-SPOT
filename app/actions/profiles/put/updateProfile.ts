'use client'

/**
 * PURPOSE:
 * Updates general user profile information fields in the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/profiles.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing profile payload.
 *   - profile (ProfileInsert, Required): Object holding updated profile fields and user profile ID.
 */

import { createClient } from '@/app/utils/supabase/client'
import { ProfileInsert } from '@/app/types/profile'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and updates table 'profiles' for the matching profile.id.
 * Returns updated profile data or error payload if database operation fails.
 *
 * PARAMETERS:
 * - { profile }: Parameter object containing profile (ProfileInsert).
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing updated profile data or error message.
 */
export async function updateProfile({ profile }: { profile: ProfileInsert }) {
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id!).select().maybeSingle();
    if (error) {
        return { error: 'Fail to update the profile' }
    }
    return { data, error }
}
