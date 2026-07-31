'use server'

/**
 * PURPOSE:
 * Fetches all user profile records stored in the profiles table from the database.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/profiles.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and executes a select query selecting all rows from table 'profiles'.
 * Returns the query result containing profile records or an error message string.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing user profiles array or error message.
 */
export async function getAllUsers() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) {
        return { error: 'Fail to fetch all user information' }
    }

    return { data, error }
}
