'use server'

/**
 * PURPOSE:
 * Fetches a single user profile record matching a specific user ID from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/profiles.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - userId (string, Required): Unique user ID string used to query the profile.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries table 'profiles' filtering by 'id' matching userId.
 * Returns single userProfile record or error detail.
 *
 * PARAMETERS:
 * - userId (string): Target user ID string.
 *
 * RETURN VALUE:
 * - Promise<{ data: any, error: any }>: Object containing userProfile payload or profileError detail.
 */
export async function getUserProfile(userId: string) {
    const supabase = await createClient()
    const { data: userProfile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()

    return { data: userProfile, error: profileError }
}
