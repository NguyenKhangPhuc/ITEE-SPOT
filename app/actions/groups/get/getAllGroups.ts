'use server'

/**
 * PURPOSE:
 * Fetches all groups from the database along with associated events, group members with profiles, and group challenges with event challenge details.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/groups.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * None.
 */

import { createClient } from '@/app/utils/supabase/server'

/**
 * BEHAVIORAL MECHANISM:
 * Initializes a Supabase server client and queries the 'groups' table joining 'events', 'group_members' (with 'profiles'),
 * and 'group_challenge' (with 'event_challenges'). Returns the fetched groups list or error message string.
 *
 * PARAMETERS:
 * None.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing all groups records array or error payload.
 */
export async function getAllGroups() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('groups').select('*, events (*), group_members (*, profiles (*)), group_challenge (*, event_challenges (*))')
    if (error) {
        return { error: 'Failed to get all groups' }
    }
    return { data, error }
}
